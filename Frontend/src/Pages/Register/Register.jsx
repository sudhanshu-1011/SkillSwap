import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import { skills } from "./Skills";
import axios from "axios";
import "./Register.css";
import Badge from "react-bootstrap/Badge";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../../util/UserContext";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {

  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isOAuth, setIsOAuth] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    portfolioLink: "",
    githubLink: "",
    linkedinLink: "",
    skillsProficientAt: [],
    skillsToLearn: [],
    education: [
      {
        id: uuidv4(),
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        score: "",
        description: "",
      },
    ],
    bio: "",
    projects: [],
  });
  const [skillsProficientAt, setSkillsProficientAt] = useState("Select some skill");
  const [skillsToLearn, setSkillsToLearn] = useState("Select some skill");
  const [techStack, setTechStack] = useState([]);

  const [activeKey, setActiveKey] = useState("registration");

  useEffect(() => {
    if (user) {
      navigate("/discover");
    }
  }, [user, navigate]);

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const { data } = await axios.get("/user/unregistered/getDetails");
        console.log("User Data: ", data.data);
        const edu = data?.data?.education;
        edu.forEach((ele) => {
          ele.id = uuidv4();
        });
        if (edu.length === 0) {
          edu.push({
            id: uuidv4(),
            institution: "",
            degree: "",
            startDate: "",
            endDate: "",
            score: "",
            description: "",
          });
        }
        const proj = data?.data?.projects;
        proj.forEach((ele) => {
          ele.id = uuidv4();
        });
        console.log(proj);
        if (proj) {
          setTechStack(proj.map((item) => "Select some Tech Stack"));
        }
        setForm((prevState) => ({
          ...prevState,
          name: data?.data?.name || "",
          email: data?.data?.email || "",
          username: data?.data?.username || "",
          skillsProficientAt: data?.data?.skillsProficientAt || [],
          skillsToLearn: data?.data?.skillsToLearn || [],
          linkedinLink: data?.data?.linkedinLink || "",
          githubLink: data?.data?.githubLink || "",
          portfolioLink: data?.data?.portfolioLink || "",
          education: edu,
          bio: data?.data?.bio || "",
          projects: proj ? proj : prevState.projects,
        }));
        if (data?.data?.email && data?.data?.name) {
          setIsOAuth(true);
        }
      } catch (error) {
        console.log("No pre-reg data found, assuming manual registration");
        setForm(prev => ({ ...prev, name: "", email: "" }));
        setIsOAuth(false);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const handleNext = () => {
    const tabs = ["registration", "education", "longer-tab", "Preview"];
    const currentIndex = tabs.indexOf(activeKey);
    if (currentIndex < tabs.length - 1) {
      setActiveKey(tabs[currentIndex + 1]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prevState) => ({
        ...prevState,
        [name]: checked ? [...prevState[name], value] : prevState[name].filter((item) => item !== value),
      }));
    } else {
      if (name === "bio" && value.length > 500) {
        toast.error("Bio should be less than 500 characters");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    // console.log("Form: ", form);
  };

  const handleAddSkill = (e) => {
    const { name } = e.target;
    if (name === "skill_to_learn") {
      if (skillsToLearn === "Select some skill") {
        toast.error("Select a skill to add");
        return;
      }
      if (form.skillsToLearn.includes(skillsToLearn)) {
        toast.error("Skill already added");
        return;
      }
      if (form.skillsProficientAt.includes(skillsToLearn)) {
        toast.error("Skill already added in skills proficient at");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        skillsToLearn: [...prevState.skillsToLearn, skillsToLearn],
      }));
    } else {
      if (skillsProficientAt === "Select some skill") {
        toast.error("Select a skill to add");
        return;
      }
      if (form.skillsProficientAt.includes(skillsProficientAt)) {
        toast.error("Skill already added");
        return;
      }
      if (form.skillsToLearn.includes(skillsProficientAt)) {
        toast.error("Skill already added in skills to learn");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        skillsProficientAt: [...prevState.skillsProficientAt, skillsProficientAt],
      }));
    }
    // console.log("Form: ", form);
  };

  const handleRemoveSkill = (e, temp) => {
    const skill = e.target.innerText.split(" ")[0];
    if (temp === "skills_proficient_at") {
      setForm((prevState) => ({
        ...prevState,
        skillsProficientAt: prevState.skillsProficientAt.filter((item) => item !== skill),
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        skillsToLearn: prevState.skillsToLearn.filter((item) => item !== skill),
      }));
    }
    console.log("Form: ", form);
  };

  const handleRemoveEducation = (e, tid) => {
    const updatedEducation = form.education.filter((item, i) => item.id !== tid);
    console.log("Updated Education: ", updatedEducation);
    setForm((prevState) => ({
      ...prevState,
      education: updatedEducation,
    }));
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      education: prevState.education.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
    }));
    console.log("Form: ", form);
  };

  const handleAdditionalChange = (e, index) => {
    const { name, value } = e.target;
    console.log("Name", name);
    console.log("Value", value);
    setForm((prevState) => ({
      ...prevState,
      projects: prevState.projects.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
    }));
    console.log("Form: ", form);
  };

  const validateRegForm = () => {
    if (!form.username) {
      toast.error("Username is empty");
      return false;
    }
    if (!form.email) {
      toast.error("Email is required");
      return false;
    }
    if (!isOAuth && !form.password) {
      toast.error("Password is required for manual registration");
      return false;
    }
    if (!isOAuth && form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!form.skillsProficientAt.length) {
      toast.error("Enter atleast one Skill you are proficient at");
      return false;
    }
    if (!form.skillsToLearn.length) {
      toast.error("Enter atleast one Skill you want to learn");
      return false;
    }
    if (!form.portfolioLink && !form.githubLink && !form.linkedinLink) {
      toast.error("Enter atleast one link among portfolio, github and linkedin");
      return false;
    }
    const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
    if (form.githubLink && githubRegex.test(form.githubLink) === false) {
      toast.error("Enter a valid github link");
      return false;
    }
    const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
    if (form.linkedinLink && linkedinRegex.test(form.linkedinLink) === false) {
      toast.error("Enter a valid linkedin link");
      return false;
    }
    if (form.portfolioLink && form.portfolioLink.includes("http") === false) {
      toast.error("Enter a valid portfolio link");
      return false;
    }
    return true;
  };
  const validateEduForm = () => {
    let isValid = true;
    form.education.forEach((edu, index) => {
      if (!edu.institution) {
        toast.error(`Institution name is empty in education field ${index + 1}`);
        isValid = false;
      }
      if (!edu.degree) {
        toast.error(`Degree is empty in education field ${index + 1}`);
        isValid = false;
      }
      if (!edu.startDate) {
        toast.error(`Start date is empty in education field ${index + 1}`);
        isValid = false;
      }
      if (!edu.endDate) {
        toast.error(`End date is empty in education field ${index + 1}`);
        isValid = false;
      }
      if (!edu.score) {
        toast.error(`Score is empty in education field ${index + 1}`);
        isValid = false;
      }
    });
    return isValid;
  };
  const validateAddForm = () => {
    if (!form.bio) {
      toast.error("Bio is empty");
      return false;
    }
    if (form.bio.length > 500) {
      toast.error("Bio should be less than 500 characters");
      return false;
    }
    var flag = true;
    form.projects.forEach((project, index) => {
      if (!project.title) {
        toast.error(`Title is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.techStack.length) {
        toast.error(`Tech Stack is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.startDate) {
        toast.error(`Start Date is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.endDate) {
        toast.error(`End Date is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.projectLink) {
        toast.error(`Project Link is empty in project ${index + 1}`);
        flag = false;
      }
      if (!project.description) {
        toast.error(`Description is empty in project ${index + 1}`);
        flag = false;
      }
      if (project.startDate > project.endDate) {
        toast.error(`Start Date should be less than End Date in project ${index + 1}`);
        flag = false;
      }
      if (!project.projectLink.match(/^(http|https):\/\/[^ "]+$/)) {
        console.log("Valid URL");
        toast.error(`Please provide valid project link in project ${index + 1}`);
        flag = false;
      }
    });
    return flag;
  };
  const handleSaveRegistration = async () => {
    const check = validateRegForm();
    if (check) {
      if (form.password) {
        toast.info("Registration details saved locally. Proceed to next step.");
        return;
      }
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/unregistered/saveRegDetails", form);
        toast.success("Details saved successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error saving registration details");
      } finally {
        setSaveLoading(false);
      }
    }
  };
  const handleSaveEducation = async () => {
    const check1 = validateRegForm();
    const check2 = validateEduForm();
    if (check1 && check2) {
      if (form.password) {
        toast.info("Education details saved locally. Proceed to next step.");
        return;
      }
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/unregistered/saveEduDetail", form);
        toast.success("Details saved successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error saving education details");
      } finally {
        setSaveLoading(false);
      }
    }
  };
  const handleSaveAdditional = async () => {
    const check1 = validateRegForm();
    const check2 = validateEduForm();
    const check3 = await validateAddForm();
    if (check1 && check2 && check3) {
      if (form.password) {
        toast.info("Additional details saved locally. You can now preview and submit.");
        return;
      }
      setSaveLoading(true);
      try {
        const { data } = await axios.post("/user/unregistered/saveAddDetail", form);
        toast.success("Details saved successfully");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Error saving additional details");
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    const check1 = validateRegForm();
    const check2 = validateEduForm();
    const check3 = validateAddForm();
    if (check1 && check2 && check3) {
      setSaveLoading(true);
      try {
        const endpoint = isOAuth ? "/user/registerUser" : "/auth/register";
        const { data } = await axios.post(endpoint, form);
        toast.success("Registration Successful");
        const userData = data.data;
        localStorage.setItem("userInfo", JSON.stringify(userData));
        setUser(userData);
        navigate("/discover");
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Some error occurred");
        }
      } finally {
        setSaveLoading(false);
      }
    }
  };

  return (
    <div className="register_page ">
      <h2 className="m-4 fw-bold text-center text-gradient">
        Registration Form
      </h2>
      {loading ? (
        <div className="row m-auto w-100 d-flex justify-content-center align-items-center" style={{ height: "80.8vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="register_section mb-3">
          <Tabs
            defaultActiveKey="registration"
            id="justify-tab-example"
            className="mb-3"
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k)}
          >
            <Tab eventKey="registration" title="Registration">
              <div className="animate-fade-in-up">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleInputChange}
                      className="form-control"
                      value={form.name}
                      disabled={isOAuth}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleInputChange}
                      className="form-control"
                      value={form.email}
                      disabled={isOAuth}
                      placeholder="john@example.com"
                    />
                  </div>
                  {!isOAuth && (
                    <div className="col-md-6">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        onChange={handleInputChange}
                        value={form.password}
                        className="form-control"
                        placeholder="••••••••"
                      />
                    </div>
                  )}
                  <div className={`${isOAuth ? 'col-12' : 'col-md-6'}`}>
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      name="username"
                      onChange={handleInputChange}
                      value={form.username}
                      className="form-control"
                      placeholder="johndoe123"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">LinkedIn profile</label>
                    <input
                      type="text"
                      name="linkedinLink"
                      value={form.linkedinLink}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">GitHub Profile</label>
                    <input
                      type="text"
                      name="githubLink"
                      value={form.githubLink}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Portfolio Website</label>
                    <input
                      type="text"
                      name="portfolioLink"
                      value={form.portfolioLink}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Skills You Can Teach</label>
                    <div className="d-flex gap-2">
                      <Form.Select
                        value={skillsProficientAt}
                        onChange={(e) => setSkillsProficientAt(e.target.value)}
                        className="form-select"
                      >
                        <option>Select a skill</option>
                        {skills.map((skill, index) => (
                          <option key={index} value={skill}>{skill}</option>
                        ))}
                      </Form.Select>
                      <button className="btn btn-primary" name="skill_proficient_at" onClick={handleAddSkill}>Add</button>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <AnimatePresence>
                        {form.skillsProficientAt.map((skill, index) => (
                          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} key={index}>
                            <Badge
                              bg="secondary"
                              style={{ cursor: "pointer" }}
                              onClick={(event) => handleRemoveSkill(event, "skills_proficient_at")}
                            >
                              {skill} &#10005;
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Skills You Want To Learn</label>
                    <div className="d-flex gap-2">
                      <Form.Select
                        value={skillsToLearn}
                        onChange={(e) => setSkillsToLearn(e.target.value)}
                        className="form-select"
                      >
                        <option>Select a skill</option>
                        {skills.map((skill, index) => (
                          <option key={index} value={skill}>{skill}</option>
                        ))}
                      </Form.Select>
                      <button className="btn btn-primary" name="skill_to_learn" onClick={handleAddSkill}>Add</button>
                    </div>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <AnimatePresence>
                        {form.skillsToLearn.map((skill, index) => (
                          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} key={index}>
                            <Badge
                              bg="secondary"
                              style={{ cursor: "pointer" }}
                              onClick={(event) => handleRemoveSkill(event, "skills_to_learn")}
                            >
                              {skill} &#10005;
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                <div className="form-actions mt-5">
                  <button className="btn btn-warning px-5" onClick={handleSaveRegistration} disabled={saveLoading}>
                    {saveLoading ? <Spinner animation="border" size="sm" /> : "Save Progress"}
                  </button>
                  <button onClick={handleNext} className="btn btn-primary px-5">
                    Next Step
                  </button>
                </div>
              </div>
            </Tab>

            <Tab eventKey="education" title="Education">
              <div className="animate-fade-in-up">
                {form.education.map((edu, index) => (
                  <div className="edu-card" key={edu.id}>
                    {index !== 0 && (
                      <button 
                        className="edu-card-remove position-absolute top-0 end-0 m-3" 
                        onClick={(e) => handleRemoveEducation(e, edu.id)}
                      >
                        Remove
                      </button>
                    )}
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Institution Name</label>
                        <input
                          type="text"
                          name="institution"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(e, index)}
                          className="form-control"
                          placeholder="University or School name"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Degree</label>
                        <input
                          type="text"
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(e, index)}
                          className="form-control"
                          placeholder="e.g. B.Tech Computer Science"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Grade / Percentage</label>
                        <input
                          type="number"
                          name="score"
                          value={edu.score}
                          onChange={(e) => handleEducationChange(e, index)}
                          className="form-control"
                          placeholder="Score"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleEducationChange(e, index)}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleEducationChange(e, index)}
                          className="form-control"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Description / Achievements</label>
                        <textarea
                          name="description"
                          value={edu.description}
                          onChange={(e) => handleEducationChange(e, index)}
                          className="form-control"
                          rows="2"
                          placeholder="Briefly describe your experience or honors"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center mt-4">
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => {
                      setForm((prevState) => ({
                        ...prevState,
                        education: [
                          ...prevState.education,
                          {
                            id: uuidv4(),
                            institution: "",
                            degree: "",
                            startDate: "",
                            endDate: "",
                            score: "",
                            description: "",
                          },
                        ],
                      }));
                    }}
                  >
                    + Add More Education
                  </button>
                </div>

                <div className="form-actions mt-5">
                  <button className="btn btn-warning px-5" onClick={handleSaveEducation} disabled={saveLoading}>
                    {saveLoading ? <Spinner animation="border" size="sm" /> : "Save Progress"}
                  </button>
                  <button onClick={handleNext} className="btn btn-primary px-5">
                    Next Step
                  </button>
                </div>
              </div>
            </Tab>

            <Tab eventKey="longer-tab" title="Additional">
              <div className="animate-fade-in-up">
                <div className="mb-4">
                  <label className="form-label">Professional Bio (Max 500 characters)</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Tell us about your journey and what you're passionate about..."
                    rows="4"
                  />
                  <div className="text-end mt-1 small text-muted">{form.bio.length}/500</div>
                </div>

                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Projects & Portfolio</h5>
                </div>

                {form.projects.map((project, index) => (
                  <div className="edu-card" key={project.id}>
                    <button 
                      className="edu-card-remove position-absolute top-0 end-0 m-3" 
                      onClick={() => {
                        setForm(prev => ({
                          ...prev,
                          projects: prev.projects.filter(p => p.id !== project.id)
                        }));
                      }}
                    >
                      Remove
                    </button>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Project Title</label>
                        <input
                          type="text"
                          name="title"
                          value={project.title}
                          onChange={(e) => handleAdditionalChange(e, index)}
                          className="form-control"
                          placeholder="e.g. SkillSwap Platform"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Tech Stack</label>
                        <div className="d-flex gap-2">
                          <Form.Select
                            value={techStack[index]}
                            onChange={(e) => {
                              const newTS = [...techStack];
                              newTS[index] = e.target.value;
                              setTechStack(newTS);
                            }}
                            className="form-select"
                          >
                            <option>Select a tech</option>
                            {skills.map((s, i) => <option key={i} value={s}>{s}</option>)}
                          </Form.Select>
                          <button 
                            className="btn btn-primary"
                            onClick={() => {
                              if (!techStack[index] || techStack[index] === "Select a tech") return;
                              setForm(prev => ({
                                ...prev,
                                projects: prev.projects.map((p, i) => 
                                  i === index ? { ...p, techStack: [...new Set([...p.techStack, techStack[index]])] } : p
                                )
                              }));
                            }}
                          >
                            Add
                          </button>
                        </div>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {project.techStack.map((ts, i) => (
                            <Badge key={i} bg="secondary" style={{ cursor: 'pointer' }} onClick={() => {
                               setForm(prev => ({
                                 ...prev,
                                 projects: prev.projects.map((p, pIdx) => 
                                   pIdx === index ? { ...p, techStack: p.techStack.filter(item => item !== ts) } : p
                                 )
                               }));
                            }}>
                              {ts} &#10005;
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Start Date</label>
                        <input type="date" name="startDate" value={project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""} onChange={(e) => handleAdditionalChange(e, index)} className="form-control" />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">End Date</label>
                        <input type="date" name="endDate" value={project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""} onChange={(e) => handleAdditionalChange(e, index)} className="form-control" />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Project Link</label>
                        <input type="text" name="projectLink" value={project.projectLink} onChange={(e) => handleAdditionalChange(e, index)} className="form-control" placeholder="https://..." />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Brief Description</label>
                        <textarea name="description" value={project.description} onChange={(e) => handleAdditionalChange(e, index)} className="form-control" rows="2" />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  className="btn btn-secondary w-100 mt-2"
                  onClick={() => {
                     setTechStack(prev => [...prev, "Select a tech"]);
                     setForm(prev => ({
                       ...prev,
                       projects: [...prev.projects, { id: uuidv4(), title: "", techStack: [], startDate: "", endDate: "", projectLink: "", description: "" }]
                     }));
                  }}
                >
                  + Add Project
                </button>

                <div className="form-actions mt-5">
                  <button className="btn btn-warning px-5" onClick={handleSaveAdditional} disabled={saveLoading}>
                    {saveLoading ? <Spinner animation="border" size="sm" /> : "Save Progress"}
                  </button>
                  <button onClick={handleNext} className="btn btn-primary px-5">
                    Next: Preview
                  </button>
                </div>
              </div>
            </Tab>

            <Tab eventKey="Preview" title="Confirm">
              <div className="animate-fade-in-up p-2">
                <h4 className="text-center mb-4 text-gradient">Review Your Profile</h4>
                
                <div className="glass-card p-4 mb-4">
                  <div className="row g-4">
                    {[
                      { label: "Name", value: form.name },
                      { label: "Username", value: form.username },
                      { label: "Email", value: form.email },
                      { label: "LinkedIn", value: form.linkedinLink },
                      { label: "GitHub", value: form.githubLink },
                      { label: "Portfolio", value: form.portfolioLink },
                    ].map((item, i) => (
                      <div className="col-md-6" key={i}>
                        <div className="small text-muted text-uppercase fw-bold mb-1">{item.label}</div>
                        <div className="text-truncate">{item.value || <span className="text-dark italic">Not provided</span>}</div>
                      </div>
                    ))}
                    <div className="col-12">
                      <div className="small text-muted text-uppercase fw-bold mb-1">Bio</div>
                      <div style={{ fontSize: '0.95rem' }}>{form.bio || <span className="text-dark">No bio provided.</span>}</div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted text-uppercase fw-bold mb-2">Teaching</div>
                      <div className="d-flex flex-wrap gap-2">
                        {form.skillsProficientAt.map((s, i) => <Badge key={i} bg="secondary">{s}</Badge>)}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="small text-muted text-uppercase fw-bold mb-2">Learning</div>
                      <div className="d-flex flex-wrap gap-2">
                        {form.skillsToLearn.map((s, i) => <Badge key={i} bg="secondary">{s}</Badge>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions justify-content-center">
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary px-5 py-3 fs-5"
                    disabled={saveLoading}
                    style={{ minWidth: '250px' }}
                  >
                    {saveLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                    Confirm & Complete
                  </button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Register;
