import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import api from '../api';
import jsPDF from 'jspdf';

function StudentFeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ paid: 0, due: 0 });
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    fetchFeesData();
  }, []);

  const fetchFeesData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Student Profile to get Class
      const { data: profile } = await api.get('/api/students/profile');
      const studentClass = profile.class;
      setStudentProfile(profile);

      // 2. Fetch Fee Records (Paid History)
      const { data: feeRecords } = await api.get('/api/fees/my-fees');
      setFees(feeRecords);

      // 3. Fetch Fee Structure
      const { data: allStructures } = await api.get('/api/fees/structure');
      
      // 4. Calculate Totals
      // Filter structures for this student's class
      const classStructures = allStructures.filter(s => s.class === studentClass);
      const totalExpected = classStructures.reduce((acc, s) => acc + (s.total_amount || 0), 0);
      
      const totalPaid = feeRecords.reduce((acc, fee) => acc + (fee.paid_amount || 0), 0);
      const totalDue = Math.max(0, totalExpected - totalPaid);

      setSummary({ paid: totalPaid, due: totalDue });

    } catch (error) {
      console.error('Error fetching fees data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (fee) => {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(22);
      doc.setTextColor(40, 116, 240); // Primary Blue
      doc.text("SATYAM STARS INTERNATIONAL SCHOOL", 105, 20, null, null, "center");
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text("Fee Payment Receipt", 105, 30, null, null, "center");
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      // Student Details
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text(`Receipt No: ${fee._id.substring(0, 8).toUpperCase()}`, 20, 50);
      doc.text(`Date: ${new Date(fee.payment_date).toLocaleDateString()}`, 140, 50);

      doc.text(`Student Name: ${studentProfile?.name || 'N/A'}`, 20, 60);
      doc.text(`Class: ${studentProfile?.class || 'N/A'}`, 140, 60);
      doc.text(`Roll No: ${studentProfile?.roll_no || 'N/A'}`, 20, 70);
      doc.text(`Admission No: ${studentProfile?.gr_no || 'N/A'}`, 140, 70);

      // Payment Details Box
      doc.setFillColor(240, 240, 240);
      doc.rect(20, 85, 170, 10, 'F');
      doc.setFont(undefined, 'bold');
      doc.text("Description", 30, 91);
      doc.text("Amount", 160, 91);
      
      doc.setFont(undefined, 'normal');
      doc.text(fee.fee_structure_id?.term || 'Fee Payment', 30, 105);
      doc.text(`Rs. ${fee.paid_amount.toLocaleString('en-IN')}`, 160, 105);

      doc.line(20, 115, 190, 115);

      // Totals
      doc.setFont(undefined, 'bold');
      doc.text("Total Paid:", 130, 125);
      doc.text(`Rs. ${fee.paid_amount.toLocaleString('en-IN')}`, 160, 125);

      // Footer
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("This is a computer-generated receipt.", 105, 150, null, null, "center");
      doc.text("Thank you for your payment.", 105, 155, null, null, "center");

      doc.save(`Receipt_${fee._id.substring(0, 8)}.pdf`);
  };

  return (
    <StudentLayout>
      <div className="container-fluid">
        <h2 className="text-primary mb-4">My Fees</h2>

        <div className="row mb-4">
            <div className="col-md-6">
                <div className="card bg-success text-white">
                    <div className="card-body text-center">
                        <h3>₹{summary.paid.toLocaleString('en-IN')}</h3>
                        <div>Total Paid</div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card bg-danger text-white">
                    <div className="card-body text-center">
                        <h3>₹{summary.due.toLocaleString('en-IN')}</h3>
                        <div>Total Due</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="card">
            <div className="card-header bg-white">
                <h5 className="mb-0">Payment History</h5>
            </div>
            <div className="card-body">
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : fees.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Fee Type</th>
                                    <th>Paid Amount</th>
                                    <th>Due Amount</th>
                                    <th>Status</th>
                                    <th>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fees.map(fee => (
                                    <tr key={fee._id}>
                                        <td>{new Date(fee.payment_date).toLocaleDateString()}</td>
                                        <td>{fee.fee_structure_id?.term || 'Fee Payment'}</td>
                                        <td>₹{fee.paid_amount.toLocaleString('en-IN')}</td>
                                        <td>₹{fee.due_amount.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className={`badge bg-${fee.status === 'Paid' ? 'success' : 'warning'}`}>
                                                {fee.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary" onClick={() => downloadReceipt(fee)}>
                                                <i className="fas fa-download"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-muted py-4">No fee records found.</p>
                )}
            </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default StudentFeesPage;
