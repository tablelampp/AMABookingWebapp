import { useState, useEffect } from 'react';

interface Coach {
  _id: string;
  name: string;
  email: string;
  hourlyRate: number;
}

interface Payment {
  _id: string;
  coach: {
    _id: string;
    name: string;
    email: string;
    hourlyRate: number;
  };
  session: {
    _id: string;
    name: string;
    start: string;
    end: string;
  };
  hours: number;
  amountOwed: number;
  amountPaid: number;
  paid: boolean;
}

interface CoachStats extends Coach {
  totalHours: number;
  totalOwed: number;
  totalPaid: number;
  remainingAmount: number;
  unpaidSessions: number;
}

interface CoachListProps {
  coaches?: Coach[];
  payments?: Payment[];
  userRole?: 'admin' | 'coach';
}

export default function CoachList({ coaches = [], payments = [], userRole = 'admin' }: CoachListProps) {
  const [coachStats, setCoachStats] = useState<CoachStats[]>([]);

  useEffect(() => {
    // Calculate stats for each coach
    const stats: CoachStats[] = coaches.map(coach => {
      const coachPayments = payments.filter(p => p.coach._id === coach._id);
      const totalHours = coachPayments.reduce((sum, p) => sum + p.hours, 0);
      const totalOwed = coachPayments.reduce((sum, p) => sum + p.amountOwed, 0);
      const totalPaid = coachPayments.reduce((sum, p) => sum + p.amountPaid, 0);
      const unpaidSessions = coachPayments.filter(p => !p.paid).length;

      return {
        ...coach,
        totalHours,
        totalOwed,
        totalPaid,
        remainingAmount: totalOwed - totalPaid,
        unpaidSessions
      };
    });

    setCoachStats(stats);
  }, [coaches, payments]);

  const handleMarkPaid = async (coachId: string) => {
    try {
      const response = await fetch(`/api/payments?coachId=${coachId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ paid: true })
      });

      if (response.ok) {
        // Refresh the page or update state
        window.location.reload();
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  if (userRole === 'coach') {
    // Show only current coach's stats
    const currentCoach = coachStats[0];
    if (!currentCoach) return <div>Loading...</div>;

    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Your Hours & Pay</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-600">Total Hours</h3>
            <p className="text-2xl font-bold text-blue-900">{currentCoach.totalHours.toFixed(1)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-600">Amount Owed</h3>
            <p className="text-2xl font-bold text-green-900">${currentCoach.totalOwed.toFixed(2)}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-600">Amount Paid</h3>
            <p className="text-2xl font-bold text-purple-900">${currentCoach.totalPaid.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg mb-4">
          <h3 className="text-sm font-medium text-yellow-600">Remaining Amount</h3>
          <p className="text-2xl font-bold text-yellow-900">${currentCoach.remainingAmount.toFixed(2)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Coach Hours & Payments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coach
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hours
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount Owed
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount Paid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coachStats.map((coach) => (
              <tr key={coach._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{coach.name}</div>
                  <div className="text-sm text-gray-500">{coach.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {coach.totalHours.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${coach.hourlyRate}/hr
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${coach.totalOwed.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${coach.totalPaid.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    coach.remainingAmount === 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {coach.remainingAmount === 0 ? 'Paid' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {coach.remainingAmount > 0 && (
                    <button
                      onClick={() => handleMarkPaid(coach._id)}
                      className="btn btn-primary text-xs"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 