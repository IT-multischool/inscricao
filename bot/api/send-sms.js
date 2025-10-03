import fetch from 'node-fetch';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { phone_number, message_body } = req.body;

    if (!phone_number || !message_body) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await fetch('https://www.telcosms.co.ao/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: {
                    api_key_app: "prdb7adf043a92620fd404d411a69",
                    phone_number: phone_number,
                    message_body: message_body
                }
            })
        });

        const data = await response.text();
        console.log('TelcoSMS Response:', data);

        if (response.ok) {
            return res.status(200).json({
                success: true,
                message: 'SMS enviado com sucesso',
                data: data
            });
        } else {
            return res.status(200).json({
                success: false,
                error: data
            });
        }
    } catch (error) {
        console.error('Erro ao enviar SMS:', error);
        return res.status(200).json({
            success: false,
            error: error.message
        });
    }
}