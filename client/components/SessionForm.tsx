import { useState, useEffect } from 'react';

interface Coach {
  _id: string;
  name: string;
  email: string;
  hourlyRate: number;
}

interface SessionFormData {
  name: string;
  start: string;
  end: string;
  daysOfWeek: number[];
  coaches: string[];
  recurring: boolean;
}

interface SessionFormProps {
  onSubmit: (data: SessionFormData) => Promise<void>;
  coaches?: Coach[];
  userRole?: 'admin' | 'coach';
}

export default function SessionForm({ onSubmit, coaches = [], userRole }: SessionFormProps) {
  const [formData, setFormData] = useState<SessionFormData>({
    name: '',
    start: '',
    end: '',
    daysOfWeek: [],
    coaches: [],
    recurring: false
  });
  const [loading, setLoading] = useState(false);

  const daysOfWeekOptions = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayToggle = (dayValue: number) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(dayValue)
        ? prev.daysOfWeek.filter(d => d !== dayValue)
        : [...prev.daysOfWeek, dayValue]
    }));
  };

  const handleCoachToggle = (coachId: string) => {
    setFormData(prev => ({
      ...prev,
      coaches: prev.coaches.includes(coachId)
        ? prev.coaches.filter(c => c !== coachId)
        : [...prev.coaches, coachId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        name: '',
        start: '',
        end: '',
        daysOfWeek: [],
        coaches: [],
        recurring: false
      });
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Create New Session</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Session Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="input"
            placeholder="e.g., Beginner Tennis Class"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="datetime-local"
              id="start"
              name="start"
              value={formData.start}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>

          <div>
            <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="datetime-local"
              id="end"
              name="end"
              value={formData.end}
              onChange={handleInputChange}
              required
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Days of Week (for recurring sessions)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {daysOfWeekOptions.map(day => (
              <label key={day.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.daysOfWeek.includes(day.value)}
                  onChange={() => handleDayToggle(day.value)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{day.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign Coaches
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {coaches.map(coach => (
              <label key={coach._id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.coaches.includes(coach._id)}
                  onChange={() => handleCoachToggle(coach._id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {coach.name} (${coach.hourlyRate}/hr)
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="recurring"
              checked={formData.recurring}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Recurring Session</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Session'}
          </button>
        </div>
      </form>
    </div>
  );
} 