exports.createGallery = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({message: "Le titre de l'album est obligatoire."});
        }
        const creatorId = req.user.id;
        const [newGalleryId] = await db("galleries")
            .insert({ 
                title: title,
                description: description || null,
                created_by: creatorId
            });
        return res.status(201).json({ 
            message : "L'album photo a été créé avec succès. Vous pouvez maintenant y ajouter des photos !",
            galleryId: newGalleryId
        });
    } catch (error) {
        console.error("Erreur lors de la création de la galerie :", error);
        return res.status(500).json({ message: "Erreur serveur lors de la création de l'album." });
        
    }
}