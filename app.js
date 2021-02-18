function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      specialAttackCountdown: 3,
      swallowUses: 0,
      maxSwallowUses: 3,
      winner: null,
      logMessages: [],
      hasFled: false,
    }
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: '0%' }
      }
      return { width: this.monsterHealth + '%' }
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: '0%' }
      }
      return { width: this.playerHealth + '%' }
    },
    isSpecialAttackCharging() {
      return this.specialAttackCountdown != 0
    },
    isSwallowEmpty() {
      return this.swallowUses >= this.maxSwallowUses
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0) {
        this.winner = 'monster'
      }
    },
    monsterHealth(value) {
      if (value <= 0) {
        this.winner = 'player'
      }
    },
  },
  methods: {
    attackMonster() {
      if (this.specialAttackCountdown > 0) {
        this.specialAttackCountdown--
      }
      const attackValue = getRandomValue(5, 12)
      this.monsterHealth -= attackValue
      this.addLogMessage('player', 'attack', attackValue)
      if (this.monsterHealth > 0) {
        this.attackPlayer()
      }
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15)
      this.playerHealth -= attackValue
      this.addLogMessage('monster', 'attack', attackValue)
    },
    specialAttackMonster() {
      this.specialAttackCountdown = 3
      const attackValue = getRandomValue(10, 25)
      this.monsterHealth -= attackValue
      this.addLogMessage('player', 'special', attackValue)
      if (this.monsterHealth > 0) {
        this.attackPlayer()
      }
    },
    healPlayer() {
      if (this.specialAttackCountdown > 0) {
        this.specialAttackCountdown--
      }
      const healValue = getRandomValue(8, 20)
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100
      } else {
        this.playerHealth += healValue
      }
      this.swallowUses++
      this.addLogMessage('player', 'heal', healValue)
      this.attackPlayer()
    },
    surrender() {
      this.hasFled = true
    },
    restartGame() {
      this.playerHealth = 100
      this.monsterHealth = 100
      this.winner = null
      this.specialAttackCountdown = 3
      this.swallowUses = 0
      this.logMessages = []
      this.hasFled = false
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      })
    },
  },
})

app.mount('#game')
