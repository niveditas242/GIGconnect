// src/components/Search/FreelancerSearch.tsx
import React, { useState, useEffect } from "react";
import { searchFreelancers } from "../../services/api"; // Remove getPopularSkills for now
import { toast } from "react-toastify";
import "./FreelancerSearch.css";

interface Freelancer {
  _id: string;
  name: string;
  title: string;
  skills: string[];
  location: string;
  experience: string;
  bio: string;
  profilePhoto?: string;
  rating?: number;
  hourlyRate?: number;
}

interface SearchParams {
  query?: string;
  skills?: string[];
  location?: string;
  minExperience?: number;
  maxExperience?: number;
  category?: string;
  page?: number;
  limit?: number;
}

const FreelancerSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    skills: [],
    location: "",
    minExperience: 0,
    maxExperience: 10,
    category: "",
  });
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [popularSkills] = useState<string[]>([
    // Use local state instead of API
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "HTML",
    "CSS",
    "TypeScript",
    "Vue.js",
    "Angular",
    "PHP",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSkill, setCurrentSkill] = useState("");

  const handleSearch = async () => {
    if (
      !searchParams.query &&
      (!searchParams.skills || searchParams.skills.length === 0) &&
      !searchParams.location
    ) {
      toast.error("Please enter search criteria");
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchFreelancers(searchParams);

      if (response.success) {
        setFreelancers(response.freelancers || []);
        if ((response.freelancers || []).length === 0) {
          toast.info("No freelancers found matching your criteria");
        }
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error("Failed to search freelancers: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (
      currentSkill.trim() &&
      !searchParams.skills?.includes(currentSkill.trim())
    ) {
      setSearchParams((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), currentSkill.trim()],
      }));
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSearchParams((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill) || [],
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="freelancer-search">
      <div className="search-header">
        <h1>Find Freelancers</h1>
        <p>Discover talented professionals for your projects</p>
      </div>

      {/* Search Filters */}
      <div className="search-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by name, skills, or keywords..."
            value={searchParams.query || ""}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, query: e.target.value }))
            }
            onKeyPress={handleKeyPress}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <input
            type="text"
            placeholder="Add a skill..."
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
            className="skill-input"
          />
          <button onClick={addSkill} className="add-skill-btn">
            Add Skill
          </button>
        </div>

        <div className="skills-tags">
          {searchParams.skills?.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
              <button onClick={() => removeSkill(skill)}>×</button>
            </span>
          ))}
        </div>

        <div className="filter-group">
          <input
            type="text"
            placeholder="Location..."
            value={searchParams.location || ""}
            onChange={(e) =>
              setSearchParams((prev) => ({ ...prev, location: e.target.value }))
            }
            className="location-input"
          />
        </div>

        <button
          onClick={handleSearch}
          className="search-btn"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search Freelancers"}
        </button>
      </div>

      {/* Search Results */}
      <div className="search-results">
        <h2>Search Results ({freelancers.length})</h2>
        {freelancers.length > 0 ? (
          <div className="freelancers-grid">
            {freelancers.map((freelancer) => (
              <div key={freelancer._id} className="freelancer-card">
                <h3>{freelancer.name}</h3>
                <p className="title">{freelancer.title}</p>
                <p className="location">{freelancer.location}</p>
                <div className="skills">
                  {freelancer.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && (
            <p>No freelancers found. Try adjusting your search criteria.</p>
          )
        )}
      </div>
    </div>
  );
};

export default FreelancerSearch;
