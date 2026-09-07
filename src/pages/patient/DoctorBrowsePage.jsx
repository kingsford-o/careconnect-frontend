import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../../components/common/DoctorCard';
import EmptyState from '../../components/common/EmptyState';

const SPECIALTIES = [
  'All Specialties',
  'General Practice',
  'Cardiology',
  'Dermatology',
  'Neurology',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Oncology',
  'Orthopedics',
  'Dentistry',
  'Ophthalmology',
  'Otolaryngology (ENT)',
  'Psychiatry',
  'Radiology',
  'Anesthesiology',
  'Emergency Medicine',
  'Internal Medicine',
  'Surgery (General)',
  'Urology',
  'Nephrology',
  'Gastroenterology',
  'Endocrinology',
  'Rheumatology',
  'Pulmonology',
  'Infectious Disease',
  'Hematology',
  'Pathology',
  'Family Medicine',
  'Sports Medicine',
  'Plastic Surgery',
  'Neurosurgery',
  'Cardiothoracic Surgery',
  'Vascular Surgery',
  'Pediatric Surgery',
  'Geriatrics',
  'Physical Medicine & Rehabilitation',
  'Medical Genetics',
  'Preventive Medicine',
  'Occupational Medicine',
  'Public Health',
  'Other'
];

export default function DoctorBrowsePage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    minRating: 0,
    maxRate: 1000,
  });

  useEffect(() => {
    fetchDoctors();
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.specialty && filters.specialty !== 'All Specialties') {
        params.append('specialty', filters.specialty);
      }
      if (filters.minRating > 0) {
        params.append('minRating', filters.minRating);
      }
      if (filters.maxRate < 1000) {
        params.append('maxRate', filters.maxRate);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/doctors?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch doctors: ${response.status}`);
      }

      const data = await response.json();
      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  // Client-side text search filtering on name, hospital, and bio
  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return doctors;
    const query = searchQuery.toLowerCase();
    return doctors.filter(doc => {
      const name = (doc.name || doc.users?.full_name || '').toLowerCase();
      const specialty = (doc.specialty || '').toLowerCase();
      const hospital = (doc.hospital || doc.hospital_name || '').toLowerCase();
      return name.includes(query) || specialty.includes(query) || hospital.includes(query);
    });
  }, [doctors, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      specialty: '',
      minRating: 0,
      maxRate: 1000,
    });
  };

  const hasActiveFilters = searchQuery.trim() !== '' || filters.specialty !== '' || filters.minRating > 0 || filters.maxRate < 1000;

  return (
    <div className="patient-dashboard-premium doctor-browse-page">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              type="button" 
              onClick={() => navigate('/patient/home')}
              className="btn btn-outline btn-sm mb-2"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}
            >
              ← Back to Dashboard
            </button>
            <h1 className="dashboard-title">Find a Medical Specialist</h1>
            <p className="dashboard-subtitle">
              Browse and connect with verified healthcare practitioners
            </p>
          </div>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <section className="filter-card-container mb-4">
        <div className="filter-search-row">
          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon-svg">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by practitioner name, specialty, or clinic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filter-controls-grid">
          <div className="filter-item">
            <label htmlFor="specialty-select">Specialty</label>
            <select
              id="specialty-select"
              value={filters.specialty}
              onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
              className="filter-select"
            >
              <option value="">All Specialties</option>
              {SPECIALTIES.filter(s => s !== 'All Specialties').map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Minimum Rating: {filters.minRating > 0 ? `${filters.minRating.toFixed(1)}+ ⭐` : 'Any'}</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
              className="filter-range"
            />
          </div>

          <div className="filter-item">
            <label>Max Consultation Fee: GHS {filters.maxRate}</label>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={filters.maxRate}
              onChange={(e) => setFilters(prev => ({ ...prev, maxRate: parseInt(e.target.value, 10) }))}
              className="filter-range"
            />
          </div>

          {hasActiveFilters && (
            <div className="filter-item-reset">
              <button 
                type="button"
                className="btn btn-outline btn-sm w-full"
                onClick={handleResetFilters}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Results Header */}
      <div className="section-header">
        <div>
          <h2>Available Specialists ({filteredDoctors.length})</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Showing verified medical practitioners ready for consultations
          </p>
        </div>
      </div>

      {/* Doctor Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Filtering medical specialists...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <EmptyState
          variant="doctors"
          title="No doctors match your criteria"
          description={hasActiveFilters ? "Try adjusting your search terms, specialty, or rate filter." : "No verified doctors are currently listed."}
          action={hasActiveFilters ? "Clear All Filters" : "Refresh"}
          onAction={hasActiveFilters ? handleResetFilters : fetchDoctors}
        />
      ) : (
        <div className="doctors-grid-premium">
          {filteredDoctors.map(doctor => (
            <DoctorCard 
              key={doctor.id}
              doctor={doctor}
              onViewProfile={() => navigate(`/patient/doctors/${doctor.id}`)}
              onBook={() => navigate(`/patient/book/${doctor.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

