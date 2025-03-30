import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'PUT':
            const { email, enrollments } = req.body;

            if (!email || !Array.isArray(enrollments)) {
                return res.status(400).json({ message: 'Špatná vstupní data' });
            }

            try {
                res.status(200).json({ message: 'Kurzy úspěšně aktualizovány' });
            } catch (error) {
                res.status(500).json({ message: 'Chyba při aktualizaci seznamu kurzů' });
            }
            break;

            case 'DELETE':
                try {
                    const { email, courseId } = req.body;
    
                    if (!email || !courseId) {
                        return res.status(400).json({ message: 'Email a ID kurzu jsou povinné.' });
                    }
    
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });
    
                    if (!user) {
                        return res.status(404).json({ message: 'Uživatel nenalezen.' });
                    }
    
                    const deletedEnrollment = await prisma.enrollment.deleteMany({
                        where: {
                            userId: user.id,
                            courseId: Number(courseId),
                        },
                    });
    
                    if (deletedEnrollment.count === 0) {
                        return res.status(404).json({ message: 'Kurz nebyl nalezen nebo uživatel není zapsán.' });
                    }
    
                    return res.status(200).json({ message: 'Kurz byl úspěšně odhlášen.' });
                } catch (error) {
                    console.error('Chyba při odhlášení z kurzu:', error);
                    return res.status(500).json({ message: 'Chyba při odhlášení z kurzu.' });
                }

        default:
            res.setHeader('Allow', ['PUT', 'DELETE']);
            res.status(405).end(`Metoda ${method} není povolená`);
    }
}
