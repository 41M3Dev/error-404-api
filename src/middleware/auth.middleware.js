const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({message: "Accès refusé. Aucun badge fourni."});
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();

    } catch(error) {
        return res.status(403).json({message: "Badge invalide ou expiré. Veuillez vous reconnecter."});
    }
};
exports.isPresident = (req, res, next) => {
    if (req.user.bde_role !== "president") {
        return res.status(403).json({message: "Accès refusé : Cette action est strictement réservée à la présidence du BDE."});
    }

    next();
};

exports.canManageEvents = (req, res, next) => {
    const allowedRoles = ["president", "responsable_evenementiel"];
    if (!allowedRoles.includes(req.user.bde_role)) {
        return res.status(403).json({
            message: "Accès refusé : Cette action est réservée à la présidence ou au pôle événementiel."
        });
    }
    
    next();
}