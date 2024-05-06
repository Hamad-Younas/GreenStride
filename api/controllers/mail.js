import { transporter} from '../utils/nodemailer.js'

export async function mail(req, res) {
    const { firstName, lastName, email, phoneNumber, comment } = req.body;

    // Validate form data
    if (!email || !firstName || !lastName || !comment) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email address' });
    }

    // Construct email message
    const mailOptions = {
        from: 'GreenStride',
        to: email,
        subject: 'Contact Form',
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phoneNumber}\nMessage: ${comment}`
    };

    try {
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}