import express from "express"
import { PrismaClient } from "@prisma/client"
import cors from 'cors'


const prisma = new PrismaClient()
const app = express();

app.use(cors())
app.use(express.json());

app.post("/usuarios", async (req, res) => {
    const { email, name, age, description, interests } = req.body;
    
    if (!email || !name) {
            console.warn("Tentativa de criar usuário com ausência de dados:", req.body);
            return res.status(400).json({ message: "Email e nome são obrigatórios." })
    }
    if (age && typeof age !== 'number') {
        console.warn("Tentativa de cr iar usuário com idade inválida:", req.body);
        return res.status(400).json({ message: "Idade deve ser um número." });
    }
    try {
    const novoUsuario = await prisma.user.create({
        data: {
            email: email,
            name: name,
            age: age,
            description: description,
            interests: interests
        }
    })

    console.log("-----------------------------------------");
        console.log("NOVO USUÁRIO CRIADO (RESULTADO DO POST):");
        console.log(novoUsuario);
        console.log("-----------------------------------------");
    
    res.status(201).json(novoUsuario)
} catch (error) {
    console.error("-----------------------------------------")
    console.error("ERRO AO CRIAR USUÁRIO (POST):", error.message)
    console.error("-----------------------------------------");
    res.status(500).json({ message: "Erro interno ao criar usuário." })
}
})

app.get("/usuarios", async (req, res) => {
    let users = []
    try {
        if (req.query) {
            users = await prisma.user.findMany({
            where: {
            name: req.query.name,
            email: req.query.email,
            age: req.query.age,
            description: req.query.description,
            interests: req.query.interests
            }
        })
    }
        else {
            users = await prisma.user.findMany()
        }
        res.status(200).json(users)
}   catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Ocorreu um erro ao buscar os usuários." });
}
        console.log("-----------------------------------------");
        console.log("USUÁRIOS:");
        console.log(users);
        console.log("-----------------------------------------"); 
})

app.put("/usuarios/:id", async (req, res ) => {

    try {
        const updateUser = await prisma.user.update({
        where: {
          id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age,
            description: req.body.description,
            interests: req.body.interests
        }
    })
    res.status(200).json(updateUser)
    console.log("-----------------------------------------");
    console.log("USUÁRIO ALTERADO:");
    console.log(updateUser);
    console.log("-----------------------------------------"); 
} catch (error) {
     console.error("Erro ao atualizar usuário:", error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: "Usuário não encontrado." });
    } else {
      res.status(500).json({ error: "Ocorreu um erro ao atualizar o usuário." });
    }
  }
})

app.delete("/usuarios/:id", async (req, res) => {
    try {
        const userDeleted = await prisma.user.delete({
        where: {
         id: req.params.id,
      },
    });
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
    console.log("-----------------------------------------");
    console.log("USUÁRIO DELETADO:");
    console.log(userDeleted);
    console.log("-----------------------------------------"); 
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: "Usuário não encontrado." });
    } else {
      res.status(500).json({ error: "Ocorreu um erro ao deletar o usuário." });
    }
  }
})

app.listen(3000)


/* caio
rrhaMJHaxzuhl32N */