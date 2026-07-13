const db = require("../config/db");

exports.registerForEvent = async (req, res) => {
    try {
        const {eventId} = req.params;
        const studentId = req.user.id;
        const event = await db("events")
            .where({id: eventId})
            .select("id", "status", "start_datetime", "max_participants")
            .first();
        if (!event || event.status !== "published") {
            return res.status(404).json({message: "L'event est introuvable."});
        }
        const heureActuelle = new Date();
        const dateDeLaSoiree = new Date(event.start_datetime);
        if (heureActuelle > dateDeLaSoiree) {
            return res.status(403).json({message: "L'heure actuelle a dépassé la date de la soirée.C'est trop tard."});
        }
        const isAlreadyRegistered = await db("events_registrations")
            .where({
                event_id: eventId,
                user_id: studentId
            })
            .first();
        if (isAlreadyRegistered) {
            return res.status(409).json({message: "Vous êtes déjà inscrit à cet événement."});
        }
        const jauge = await db("events_registrations")
            .where({event_id: eventId})
            .count("id as total")
            .first();
        const nombreInscrits = jauge.total;
        if (nombreInscrits >= event.max_participants) {
            return res.status(403).json({message: "le nombre de participant est complet. Les inscriptions sont fermées."})
        }
        await db("events_registrations").insert({
            event_id: eventId,
            user_id: studentId
        });
        return res.status(201).json({message: "Inscription validée avec succès ! Prépare-toi pour la soirée."}
        );
        
    } catch (error) {
        console.error("Erreur lors de l'inscription a l'événement :", error);
        return res.status(500).json({ message: "Erreur interne du serveur lors de la billetterie." });
    }
};
