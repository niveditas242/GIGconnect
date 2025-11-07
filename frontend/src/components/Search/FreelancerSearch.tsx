// src/components/FreelancersSearch.tsx
import React, { useState, useEffect } from "react";
import { searchFreelancers, getSearchFilters } from "../../services/api"; // Changed from '../services/api' to '../../services/api'
import { toast } from "react-toastify";
import "./FreelancersSearch.css";
interface Freelancer {
  id: string;
  freelancerId: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  location: string;
  experience: string;
  profilePhoto: string;
  projects: any[];
  hourlyRate?: number;
  rating?: number;
}

interface SearchFilters {
  skills: string[];
  categories: string[];
  locations: string[];
  experienceLevels: string[];
}

const FreelancersSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("any");
  const [selectedLocation, setSelectedLocation] = useState("remote");
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    skills: [],
    categories: [],
    locations: [],
    experienceLevels: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load available filters
  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const response = await getSearchFilters();
      if (response.success) {
        setFilters(response.filters);
      }
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter skills to search for");
      return;
    }

    setIsLoading(true);
    try {
      const searchFilters = {
        searchQuery: searchQuery.trim(),
        category: selectedCategory !== "all" ? selectedCategory : "",
        experience: selectedExperience !== "any" ? selectedExperience : "",
        location: selectedLocation !== "any" ? selectedLocation : "",
      };

      const response = await searchFreelancers(searchFilters);

      if (response.success) {
        setFreelancers(response.freelancers);
        setHasSearched(true);
        toast.success(`Found ${response.freelancers.length} freelancers`);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(error.message || "Failed to search freelancers");
      setFreelancers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedExperience("any");
    setSelectedLocation("remote");
    setFreelancers([]);
    setHasSearched(false);
  };

  return (
    <div className="freelancers-search">
      {/* Hero Section */}
      <div className="search-hero">
        <div className="search-hero-content">
          <h1>Find Perfect Freelancers</h1>
          <p>Discover top talent for your projects</p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="search-container">
        <div className="search-filters">
          {/* Skills Search Input */}
          <div className="search-input-group">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What skills are you looking for? e.g., React Developer, UI Designer..."
              className="skills-search-input"
            />
          </div>

          <div className="filter-row">
            {/* Category Filter */}
            <div className="filter-group">
              <div className="filter-icon">📁</div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-app">Mobile App</option>
                <option value="ui-ux">UI/UX Design</option>
                <option value="graphic-design">Graphic Design</option>
                <option value="other">Other</option>
              </select>
              <div className="dropdown-arrow">▼</div>
            </div>

            {/* Experience Filter */}
            <div className="filter-group">
              <div className="filter-icon">⭐</div>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="filter-select"
              >
                <option value="any">Any Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
              <div className="dropdown-arrow">▼</div>
            </div>

            {/* Location Filter */}
            <div className="filter-group">
              <div className="filter-icon">🌍</div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                <option value="remote">Remote Only</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
                <option value="any">Any Location</option>
              </select>
              <div className="dropdown-arrow">▼</div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="search-button"
            >
              <span className="search-button-icon">✨</span>
              {isLoading ? "Searching..." : "Search Freelancers"}
              <span className="search-arrow">→</span>
            </button>
          </div>

          {/* Clear Filters */}
          {hasSearched && (
            <div className="clear-filters">
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="search-results">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Searching for perfect freelancers...</p>
            </div>
          ) : hasSearched ? (
            <>
              <div className="results-header">
                <h2>Found {freelancers.length} Freelancers</h2>
                <p>Matching your search criteria</p>
              </div>

              {freelancers.length > 0 ? (
                <div className="freelancers-grid">
                  {freelancers.map((freelancer) => (
                    <div key={freelancer.id} className="freelancer-card">
                      <div className="freelancer-header">
                        <div className="freelancer-avatar">
                          {freelancer.profilePhoto ? (
                            <img
                              src={freelancer.profilePhoto}
                              alt={freelancer.name}
                              className="avatar-image"
                            />
                          ) : (
                            <div className="avatar-fallback">
                              {freelancer.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="freelancer-info">
                          <h3>{freelancer.name}</h3>
                          <p className="freelancer-title">{freelancer.title}</p>
                          <p className="freelancer-location">
                            <span className="location-icon">📍</span>
                            {freelancer.location || "Remote"}
                          </p>
                        </div>
                      </div>

                      <div className="freelancer-bio">
                        <p>{freelancer.bio || "No bio available"}</p>
                      </div>

                      <div className="freelancer-skills">
                        {freelancer.skills.slice(0, 4).map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        ))}
                        {freelancer.skills.length > 4 && (
                          <span className="skill-tag-more">
                            +{freelancer.skills.length - 4} more
                          </span>
                        )}
                      </div>

                      <div className="freelancer-stats">
                        {freelancer.experience && (
                          <div className="stat">
                            <span className="stat-label">Experience</span>
                            <span className="stat-value">
                              {freelancer.experience} years
                            </span>
                          </div>
                        )}
                        {freelancer.hourlyRate && (
                          <div className="stat">
                            <span className="stat-label">Rate</span>
                            <span className="stat-value">
                              ${freelancer.hourlyRate}/hr
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="freelancer-projects">
                        <span className="projects-count">
                          {freelancer.projects.length} projects
                        </span>
                      </div>

                      <button className="view-portfolio-btn">
                        View Portfolio
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No freelancers found</h3>
                  <p>
                    Try adjusting your search criteria or browse all categories
                  </p>
                  <button onClick={clearFilters} className="browse-all-btn">
                    Browse All Freelancers
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="initial-state">
              <div className="initial-icon">👨‍💻</div>
              <h3>Find Your Perfect Match</h3>
              <p>
                Search for freelancers by skills, experience, and location to
                find the right talent for your project.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancersSearch;
