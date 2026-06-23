const db = require("../config/db");

exports.getAllPromos = async (req, res) => {
    try {
        const promos =await db("promos").select("*");
        return res.status(200).json(promos);
        
    } catch (error) {
        console.error("Erreur lors de la récupération des promos :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération des promotions"});
    }
}

exports.createPromo = async (req, res) => {
    try {
        const {name} = req.body;
        if (!name) {
            return res.status(400).json({message: "Le nom de la promotion est obligatoire."});
        }
        const [newPromoId] = await db("promos").insert({
            name: name
        })
        return res.status(201).json({
            message: "Promotion créer avec succès !",
            id: newPromoId
        })
    } catch (error) {
        console.error("Erreur lors de la création de la promo :", error);
        return res.status(500).json({message: "Erreur lors de la création de la promotion"});
    }
}