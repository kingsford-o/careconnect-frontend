import { useState } from 'react';

export default function ProfileForm({ 
  user, 
  role, 
  onSubmit, 
  loading = false,
  initialData = {}
}) {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || user?.full_name || '',
    email: initialData.email || user?.email || '',
    phone: initialData.phone || '',
    date_of_birth: initialData.date_of_birth || '',
    gender: initialData.gender || '',
    bio: initialData.bio || '',
    location: initialData.location || '',
    preferred_language: initialData.preferred_language || '',
    specialty: initialData.specialty || '',
    years_experience: initialData.years_experience || '',
    hospital_name: initialData.hospital_name || '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name || formData.full_name.length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (role === 'doctor' && formData.years_experience) {
      const years = parseInt(formData.years_experience);
      if (isNaN(years) || years < 0 || years > 70) {
        newErrors.years_experience = 'Please enter a valid number of years';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
      location: formData.location,
      preferred_language: formData.preferred_language,
    };

    if (role === 'patient') {
      submitData.date_of_birth = formData.date_of_birth;
      submitData.gender = formData.gender;
    } else if (role === 'doctor') {
      submitData.specialty = formData.specialty;
      submitData.years_experience = formData.years_experience ? parseInt(formData.years_experience) : null;
      submitData.hospital_name = formData.hospital_name;
    }

    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      {/* Common Fields */}
      <div className="form-group">
        <label htmlFor="full_name">Full Name *</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          disabled={loading}
          className={errors.full_name ? 'error' : ''}
          aria-invalid={!!errors.full_name}
          aria-describedby={errors.full_name ? 'full_name-error' : undefined}
        />
        {errors.full_name && (
          <span id="full_name-error" className="error" role="alert">
            {errors.full_name}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          className={errors.email ? 'error' : ''}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={loading}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          disabled={loading}
          placeholder="City, Country"
        />
      </div>

      <div className="form-group">
        <label htmlFor="preferred_language">Preferred Language</label>
        <select
          id="preferred_language"
          name="preferred_language"
          value={formData.preferred_language}
          onChange={handleChange}
          disabled={loading}
        >
          <option value="">Select language</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="ja">Japanese</option>
          <option value="ar">Arabic</option>
          <option value="pt">Portuguese</option>
        </select>
      </div>

      {/* Patient-specific Fields */}
      {role === 'patient' && (
        <>
          <div className="form-group">
            <label htmlFor="date_of_birth">Date of Birth</label>
            <input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </>
      )}

      {/* Doctor-specific Fields */}
      {role === 'doctor' && (
        <>
          <div className="form-group">
            <label htmlFor="specialty">Specialty</label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g., Cardiology, Pediatrics"
            />
          </div>

          <div className="form-group">
            <label htmlFor="years_experience">Years of Experience</label>
            <input
              type="number"
              id="years_experience"
              name="years_experience"
              value={formData.years_experience}
              onChange={handleChange}
              disabled={loading}
              min="0"
              max="70"
              placeholder="e.g., 10"
              className={errors.years_experience ? 'error' : ''}
              aria-invalid={!!errors.years_experience}
              aria-describedby={errors.years_experience ? 'years_experience-error' : undefined}
            />
            {errors.years_experience && (
              <span id="years_experience-error" className="error" role="alert">
                {errors.years_experience}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="hospital_name">Clinic/Hospital Name</label>
            <input
              type="text"
              id="hospital_name"
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              disabled={loading}
              placeholder="e.g., City General Hospital"
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label htmlFor="bio">About Me / Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={loading}
          rows={4}
          placeholder="Tell us a bit about yourself..."
          maxLength={500}
        />
        <span className="character-count">
          {formData.bio.length}/500
        </span>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
