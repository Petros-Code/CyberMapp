import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Email invalide"),
	password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, "Le nom d'utilisateur doit faire au moins 3 caractères")
			.max(20, "Le nom d'utilisateur ne peut pas dépasser 20 caractères"),
		email: z.email("Email invalide"),
		password: z
			.string()
			.min(8, "Le mot de passe doit contenir au moins 8 caractères")
			.regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
			.regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Les mots de passe ne correspondent pas",
		path: ["confirmPassword"],
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
