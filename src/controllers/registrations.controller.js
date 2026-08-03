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
        const isAlreadyRegistered = await db("event_registrations")
            .where({
                event_id: eventId,
                user_id: studentId
            })
            .first();
        if (isAlreadyRegistered) {
            return res.status(409).json({message: "Vous êtes déjà inscrit à cet événement."});
        }
        const jauge = await db("event_registrations")
            .where({event_id: eventId})
            .count("id as total")
            .first();
        const nombreInscrits = jauge.total;
        if (nombreInscrits >= event.max_participants) {
            return res.status(403).json({message: "le nombre de participant est complet. Les inscriptions sont fermées."})
        }
        await db("event_registrations").insert({
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

exports.getEventAttendees = async (req, res) => {
    try {
        const {eventId} = req.params;
        const event = await db("events")
            .where({id: eventId})
            .first();
        if (!event) {
            return res.status(404).json({ message: "Evenement introuvable. "});
        }
        const attendees = await db("event_registrations")
            .join("users", "event_registrations.user_id", "users.id")
            .where({ "event_registrations.event_id": eventId })
            .select(
                "users.id",
                "users.first_name",
                "users.last_name",
                "users.role",
                "event_registrations.status",
                "event_registrations.registered_at"
            )
            .orderBy("event_registrations.registered_at", "desc");
        return res.status(200).json({
            total_attendees: attendees.length,
            attendees: attendees
        });
        
        }catch (error) {
        console.error("Erreur lors de la récupération des inscrits :", error);
        return res.status(500).json({ message: "Erreur lors de la récupération de la liste." })
    }
};

exports.cancelRegistration = async (req, res) => {
    try {
        const { eventId } = req.params;
        const studentId = req.user.id;
        const registration = await db("event_registrations")
            .where({ event_id: eventId, user_id: studentId })
            .first();
        
        if (!registration) {
            return res.status(404).json({ message: "Vous n'êtes pas inscrit à cet événement." });
        }
        if (registration.status === "cancelled") {
            return res.status(400).json({ message: "Votre inscription est déja annulée." });
        }
        await db("event_registrations")
            .where({ id: registration.id })
            .update({
                status: "cancelled",
            });
        return res.status(200).json({ message: "Ton inscription a bien été annulée." });
    } catch (error) {
        console.error("Erreur lors de l'annulation :", error);
        return res.status(500).json({ message: "Erreur lors de l'annulation du billet."});
    }
};