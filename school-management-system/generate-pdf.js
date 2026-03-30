const { jsPDF } = require('jspdf');
const fs = require('fs');

const doc = new jsPDF();

doc.setFontSize(22);
doc.text("SATYAM STARS INTERNATIONAL SCHOOL", 20, 20);
doc.setFontSize(18);
doc.text("Management System - Project Documentation", 20, 30);

doc.setFontSize(12);
doc.text("1. Project Introduction", 20, 45);
doc.text("The Satyam Stars International School Management System is a full-stack web application", 20, 52);
doc.text("built to manage academic and administrative school operations efficiently.", 20, 58);

doc.text("2. Modules", 20, 70);
doc.text("- Admin Module: Student & Staff management, Fees, Admissions, Salary, Notices.", 20, 77);
doc.text("- Staff Module: Attendance, Exams, Salary details, Doubt Chat.", 20, 83);
doc.text("- Student Module: Profile, Attendance, Fees, Results, Doubt Chat.", 20, 89);
doc.text("- Public Website: Home, About, Admissions, Latest News.", 20, 95);

doc.text("3. Technology Stack (MERN)", 20, 110);
doc.text("- Frontend: React.js, Bootstrap 5, FontAwesome 6.", 20, 117);
doc.text("- Backend: Node.js, Express.js.", 20, 123);
doc.text("- Database: MongoDB with Mongoose.", 20, 129);
doc.text("- Real-time Communication: Socket.io.", 20, 135);

doc.text("4. Key Libraries & Tools", 20, 150);
doc.text("- Reports (PDF): jspdf & jspdf-autotable.", 20, 157);
doc.text("- Reports (Excel): xlsx.", 20, 163);
doc.text("- Visuals: Chart.js & react-chartjs-2.", 20, 169);
doc.text("- Security: bcryptjs, express-session, connect-mongo.", 20, 175);
doc.text("- Logging: winston & winston-mongodb.", 20, 181);
doc.text("- API: axios.", 20, 187);

doc.text("5. Advanced Features", 20, 200);
doc.text("- Real-time doubt-clearing chat system.", 20, 207);
doc.text("- Automated salary & fee calculations.", 20, 213);
doc.text("- Role-based access control (RBAC).", 20, 219);
doc.text("- Dynamic news management for the public website.", 20, 225);

const pdfContent = doc.output();
fs.writeFileSync('Project_Documentation.pdf', Buffer.from(pdfContent, 'binary'));
console.log('PDF generated successfully!');
