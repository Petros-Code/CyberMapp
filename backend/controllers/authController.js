import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { createUser, findUserByEmail, verifyUserToken } from '../model/userModel.js'
import transporter from '../config/mailer.js'

// Register
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        
        const existing = await findUserByEmail(email)
        if (existing) {
            return res.status(409).json({ message: 'Email déjà utilisé' })
        }
        
        const hashedPassword = await argon2.hash(password)
        const verify_token = randomUUID()

        await createUser({ username, email, password: hashedPassword, verify_token })
        
        await transporter.sendMail({
            from: `"CyberMapp" <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'Vérifie ton compte CyberMapp',
            html: `
                <h2>Bienvenue sur CyberMapp !</h2>
                <p>Clique sur le lien ci-dessous pour vérifier ton email :</p>
                <a href="${process.env.CLIENT_URL}/verify/${verify_token}">
                    Vérifier mon email
                </a>
            `,
        })

        res.status(201).json({ message: 'Compte créé, vérifie ton email' })
        
    } catch (err) {
        console.error('Erreur register :', err)
        res.status(500).json({ message: "Erreur serveur" })
    }
}

// Vérification email
export const verify = async (req, res) => {
    try {
        const { token } = req.params

        const result = await verifyUserToken(token)

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Token invalide" })
        }

        res.json({ message: "Email vérifié, connexion possible" })

    } catch (err) {
        console.error('Erreur verif :', err)
        res.status(500).json({ message: "Erreur serveur" })
    }
}

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await findUserByEmail(email)
        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects' })
        }

        if (!user.is_verified) {
            return res.status(403).json({ message: 'Email non vérifié' })
        }

        const valid = await argon2.verify(user.password, password)
        if (!valid) {
            return res.status(401).json({ message: 'Identifiants incorrects' })
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        })

    } catch (err) {
        console.error('Erreur de login :', err)
        res.status(500).json({ message: 'Erreur serveur' })
    }
}