import app from "./app"
import sequelize from "./config/database"

const porta = 3000

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database sincronizado")
    app.listen(porta, () => {
      console.log("Servidor rodando na porta " + porta)
    })
  })
  .catch((error) => {
    console.error("Erro ao sincronizar o banco:", error)
  })