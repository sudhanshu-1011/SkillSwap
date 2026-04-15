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

const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
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
              {/* Name */}
              <div>
                <label className="form-label fw-semibold text-muted small">Name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  value={form.name}
                  disabled={isOAuth}
                />
              </div>
              {/* Email */}
              <div>
                <label className="mt-3 form-label fw-semibold text-muted small">
                  Email
                </label>
                <br />
                <input
                  type="text"
                  name="email"
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  value={form.email}
                  disabled={isOAuth}
                />
              </div>
              {/* Password */}
              <div>
                <label className="mt-3 form-label fw-semibold text-muted small">
                  Password
                </label>
                <br />
                <input
                  type="password"
                  name="password"
                  onChange={handleInputChange}
                  value={form.password}
                  className="form-control mb-2"
                  placeholder="Enter a strong password"
                />
              </div>
              {/* Username */}
              <div>
                <label className="mt-3 form-label fw-semibold text-muted small">
                  Username
                </label>
                <br />
                <input
                  type="text"
                  name="username"
                  onChange={handleInputChange}
                  value={form.username}
                  className="form-control mb-2"
                  placeholder="Enter your username"
                />
              </div>
              {/* Linkedin Profile Link*/}
              <div>
                <label className="mt-3 form-label fw-semibold text-muted small">
                  Linkedin Link
                </label>
                <br />
                <input
                  type="text"
                  name="linkedinLink"
                  value={form.linkedinLink}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  placeholder="Enter your Linkedin link"
                />
              </div>
              {/* Github Profile Link*/}
              <div>
                <label className="mt-3 form-label fw-semibold text-muted small">
                  Github Link
                </label>
                <br />
                <input
                  type="text"
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  placeholder="Enter your Github link"
                />
              </div>
              {/* Portfolio Link */}
              <div>
                <label className="mt-3 form-label fw-semibold text-muted small">
                  Portfolio Link
                </label>
                <br />
                <input
                  type="text"
                  name="portfolioLink"
                  value={form.portfolioLink}
                  onChange={handleInputChange}
                  className="form-control mb-2"
                  placeholder="Enter your portfolio link"
                />
              </div>
              {/* Skills Proficient At */}
              <div>
                <label className="mt-3 form-label fw-semibold text-muted small">
                  Skills Proficient At
                </label>
                <br />
                <Form.Select
                  aria-label="Default select example"
                  value={skillsProficientAt}
                  onChange={(e) => setSkillsProficientAt(e.target.value)}
                >
                  <option>Select some skill</option>
                  {skills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </Form.Select>
                {form.skillsProficientAt.length > 0 && (
                  <div>
                    {form.skillsProficientAt.map((skill, index) => (
                      <Badge
                        key={index}
                        bg="secondary"
                        className="ms-2 mt-2"
                        style={{ cursor: "pointer" }}
                        onClick={(event) => handleRemoveSkill(event, "skills_proficient_at")}
                      >
                        <div className="span d-flex p-1 fs-7 ">{skill} &#10005;</div>
                      </Badge>
                    ))}
                  </div>
                )}
                <button className="btn btn-primary mt-3 ms-1" name="skill_proficient_at" onClick={handleAddSkill}>
                  Add Skill
                </button>
              </div>
              {/* Skills to learn */}
              <div>
                <label style={{ color: "var(--primary)", marginTop: "20px" }}>Skills To Learn</label>
                <br />
                <Form.Select
                  aria-label="Default select example"
                  value={skillsToLearn}
                  onChange={(e) => setSkillsToLearn(e.target.value)}
                >
                  <option>Select some skill</option>
                  {skills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </Form.Select>
                {form.skillsToLearn.length > 0 && (
                  <div>
                    {form.skillsToLearn.map((skill, index) => (
                      <Badge
                        key={index}
                        bg="secondary"
                        className="ms-2 mt-2 "
                        style={{ cursor: "pointer" }}
                        onClick={(event) => handleRemoveSkill(event, "skills_to_learn")}
                      >
                        <div className="span d-flex p-1 fs-7 ">{skill} &#10005;</div>
                      </Badge>
                    ))}
                  </div>
                )}
                <button className="btn btn-primary mt-3 ms-1" name="skill_to_learn" onClick={handleAddSkill}>
                  Add Skill
                </button>
              </div>
              <div className="row m-auto d-flex justify-content-center mt-3">
                <button className="btn btn-warning" onClick={handleSaveRegistration} disabled={saveLoading}>
                  {saveLoading ? <Spinner animation="border" variant="primary" /> : "Save"}
                </button>
                <button onClick={handleNext} className="mt-2 btn btn-primary">
                  Next
                </button>
              </div>
            </Tab>
            <Tab eventKey="education" title="Education">
              {form.education.map((edu, index) => (
                <div className="border border-dark rounded-1 p-3 m-1" key={edu.id}>
                  {index !== 0 && (
                    <span className="w-100 d-flex justify-content-end">
                      <button className="w-25" onClick={(e) => handleRemoveEducation(e, edu.id)}>
                        cross
                      </button>
                    </span>
                  )}
                  <label className="form-label fw-semibold text-muted small">Institution Name</label>
                  <br />
                  <input
                    type="text"
                    name="institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(e, index)}
                    style={{
                      borderRadius: "5px",
                      border: "1px solid var(--primary)",
                      padding: "5px",
                      width: "100%",
                    }}
                    placeholder="Enter your institution name"
                  />
                  <label className="mt-2 form-label fw-semibold text-muted small">
                    Degree
                  </label>
                  <br />
                  <input
                    type="text"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(e, index)}
                    style={{
                      borderRadius: "5px",
                      border: "1px solid var(--primary)",
                      padding: "5px",
                      width: "100%",
                    }}
                    placeholder="Enter your degree"
                  />
                  <label className="mt-2 form-label fw-semibold text-muted small">
                    Grade/Percentage
                  </label>
                  <br />
                  <input
                    type="number"
                    name="score"
                    value={edu.score}
                    onChange={(e) => handleEducationChange(e, index)}
                    style={{
                      borderRadius: "5px",
                      border: "1px solid var(--primary)",
                      padding: "5px",
                      width: "100%",
                    }}
                    placeholder="Enter your grade/percentage"
                  />
                  <div className="row w-100">
                    <div className="col-md-6">
                      <label className="mt-2 form-label fw-semibold text-muted small">
                        Start Date
                      </label>
                      <br />
                      <input
                        type="date"
                        name="startDate"
                        value={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        style={{
                          borderRadius: "5px",
                          border: "1px solid var(--primary)",
                          padding: "5px",
                          width: "100%",
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="mt-2 form-label fw-semibold text-muted small">
                        End Date
                      </label>
                      <br />
                      <input
                        type="date"
                        name="endDate"
                        value={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleEducationChange(e, index)}
                        style={{
                          borderRadius: "5px",
                          border: "1px solid var(--primary)",
                          padding: "5px",
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>
                  <label className="mt-2 form-label fw-semibold text-muted small">
                    Description
                  </label>
                  <br />
                  <input
                    type="text"
                    name="description"
                    value={edu.description}
                    onChange={(e) => handleEducationChange(e, index)}
                    style={{
                      borderRadius: "5px",
                      border: "1px solid var(--primary)",
                      padding: "5px",
                      width: "100%",
                    }}
                    placeholder="Enter your exp or achievements"
                  />
                </div>
              ))}
              <div className="row my-2 d-flex justify-content-center">
                <button
                  className="btn btn-primary w-50"
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
                  Add Education
                </button>
              </div>
              <div className="row m-auto d-flex justify-content-center mt-3">
                <button className="btn btn-warning" onClick={handleSaveEducation} disabled={saveLoading}>
                  {saveLoading ? <Spinner animation="border" variant="primary" /> : "Save"}
                </button>
                <button onClick={handleNext} className="mt-2 btn btn-primary">
                  Next
                </button>
              </div>
            </Tab>
            <Tab eventKey="longer-tab" title="Additional">
              <div>
                <label style={{ color: "var(--primary)", marginTop: "20px" }}>Bio (Max 500 Character)</label>
                <br />
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleInputChange}
                  className="form-control mb-3"
                  placeholder="Enter your bio"
                ></textarea>
              </div>
              <div className="">
                <label className="form-label fw-semibold text-muted small">Projects</label>

                {form.projects.map((project, index) => (
                  <div className="border border-dark rounded-1 p-3 m-1" key={project.id}>
                    <span className="w-100 d-flex justify-content-end">
                      <button
                        className="w-25"
                        onClick={() => {
                          setForm((prevState) => ({
                            ...prevState,
                            projects: prevState.projects.filter((item) => item.id !== project.id),
                          }));
                        }}
                      >
                        cross
                      </button>
                    </span>
                    <label className="form-label fw-semibold text-muted small">Title</label>
                    <br />
                    <input
                      type="text"
                      name="title"
                      value={project.title}
                      onChange={(e) => handleAdditionalChange(e, index)}
                      style={{
                        borderRadius: "5px",
                        border: "1px solid var(--primary)",
                        padding: "5px",
                        width: "100%",
                      }}
                      placeholder="Enter your project title"
                    />
                    <label className="mt-2 form-label fw-semibold text-muted small">
                      Tech Stack
                    </label>
                    <br />
                    <Form.Select
                      aria-label="Default select example"
                      value={techStack[index]}
                      onChange={(e) => {
                        setTechStack((prevState) => prevState.map((item, i) => (i === index ? e.target.value : item)));
                      }}
                    >
                      <option>Select some Tech Stack</option>
                      {skills.map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </Form.Select>
                    {techStack[index].length > 0 && (
                      <div>
                        {form.projects[index].techStack.map((skill, i) => (
                          <Badge
                            key={i}
                            bg="secondary"
                            className="ms-2 mt-2"
                            style={{ cursor: "pointer" }}
                            onClick={(e) => {
                              setForm((prevState) => ({
                                ...prevState,
                                projects: prevState.projects.map((item, i) =>
                                  i === index
                                    ? { ...item, techStack: item.techStack.filter((item) => item !== skill) }
                                    : item
                                ),
                              }));
                            }}
                          >
                            <div className="span d-flex p-1 fs-7 ">{skill} &#10005;</div>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <button
                      className="btn btn-primary mt-3 ms-1"
                      name="tech_stack"
                      onClick={(e) => {
                        if (techStack[index] === "Select some Tech Stack") {
                          toast.error("Select a tech stack to add");
                          return;
                        }
                        if (form.projects[index].techStack.includes(techStack[index])) {
                          toast.error("Tech Stack already added");
                          return;
                        }
                        setForm((prevState) => ({
                          ...prevState,
                          projects: prevState.projects.map((item, i) =>
                            i === index ? { ...item, techStack: [...item.techStack, techStack[index]] } : item
                          ),
                        }));
                      }}
                    >
                      Add Tech Stack
                    </button>
                    <div className="row">
                      <div className="col-md-6">
                        <label className="mt-2 form-label fw-semibold text-muted small">
                          Start Date
                        </label>
                        <br />
                        <input
                          type="date"
                          name="startDate"
                          value={project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleAdditionalChange(e, index)}
                          style={{
                            borderRadius: "5px",
                            border: "1px solid var(--primary)",
                            padding: "5px",
                            width: "100%",
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="mt-2 form-label fw-semibold text-muted small">
                          End Date
                        </label>
                        <br />
                        <input
                          type="date"
                          name="endDate"
                          value={project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""}
                          onChange={(e) => handleAdditionalChange(e, index)}
                          style={{
                            borderRadius: "5px",
                            border: "1px solid var(--primary)",
                            padding: "5px",
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>
                    <label className="mt-2 form-label fw-semibold text-muted small">
                      Project Link
                    </label>
                    <br />
                    <input
                      type="text"
                      name="projectLink"
                      value={project.projectLink}
                      onChange={(e) => handleAdditionalChange(e, index)}
                      style={{
                        borderRadius: "5px",
                        border: "1px solid var(--primary)",
                        padding: "5px",
                        width: "100%",
                      }}
                      placeholder="Enter your project link"
                    />

                    <label className="mt-2 form-label fw-semibold text-muted small">
                      Description
                    </label>
                    <br />
                    <input
                      type="text"
                      name="description"
                      value={project.description}
                      onChange={(e) => handleAdditionalChange(e, index)}
                      style={{
                        borderRadius: "5px",
                        border: "1px solid var(--primary)",
                        padding: "5px",
                        width: "100%",
                      }}
                      placeholder="Enter your project description"
                    />
                  </div>
                ))}

                <div className="row my-2 d-flex justify-content-center">
                  <button
                    className="btn btn-primary w-50"
                    onClick={() => {
                      setTechStack((prevState) => {
                        return [...prevState, "Select some Tech Stack"];
                      });
                      setForm((prevState) => ({
                        ...prevState,
                        projects: [
                          ...prevState.projects,
                          {
                            id: uuidv4(),
                            title: "",
                            techStack: [],
                            startDate: "",
                            endDate: "",
                            projectLink: "",
                            description: "",
                          },
                        ],
                      }));
                    }}
                  >
                    Add Project
                  </button>
                </div>
              </div>
              <div className="row m-auto d-flex justify-content-center mt-3">
                <button className="btn btn-warning" onClick={handleSaveAdditional} disabled={saveLoading}>
                  {saveLoading ? <Spinner animation="border" variant="primary" /> : "Save"}
                </button>
                <button onClick={handleNext} className="mt-2 btn btn-primary">
                  Next
                </button>
              </div>
            </Tab>
            <Tab eventKey="Preview" title="Confirm Details">
              <div>
                <h3 className="w-100 text-center fw-bold text-gradient mb-4">
                  Preview of the Form
                </h3>
                <div className="previewForm" style={{ fontFamily: "Montserrat, sans-serif", color: "#2d2d2d", marginBottom: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "70vw",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                    className="link m-sm-0"
                  >
                    <span className="fw-semibold text-muted" style={{ flex: 1 }}>Name:</span>
                    <span style={{ flex: 2 }}>{form.name || "Yet to be filled"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "70vw",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                    className="link"
                  >
                    <span className="fw-semibold text-muted" style={{ flex: 1 }}>Email ID:</span>
                    <span style={{ flex: 2 }}>{form.email || "Yet to be filled"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "70vw",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                    className="link"
                  >
                    <span className="fw-semibold text-muted" style={{ flex: 1 }}>Username:</span>
                    <span style={{ flex: 2 }}>{form.username || "Yet to be filled"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "70vw",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                    className="link"
                  >
                    <span className="fw-semibold text-muted" style={{ flex: 1 }}>Portfolio Link:</span>
                    <span style={{ flex: 2 }}>{form.portfolioLink || "Yet to be filled"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "70vw",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                    className="link"
                  >
                    <span className="fw-semibold text-muted" style={{ flex: 1 }}>Github Link:</span>
                    <span style={{ flex: 2 }}>{form.githubLink || "Yet to be filled"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "70vw",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      marginBottom: "10px",
                    }}
                    className="link"
                  >
                    <span className="fw-semibold text-muted" style={{ flex: 1 }}>Linkedin Link:</span>
                    <span
                      style={{
                        width: "70vw",
                        alignItems: "center",
                        flex: 2,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        marginBottom: "1.5rem",
                      }}
                    >
                      {form.linkedinLink || "Yet to be filled"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "70vw",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                    className="link"
                  >
                    <span className="fw-semibold text-muted" style={{ flex: 1 }}>Skills Proficient At:</span>
                    <span style={{ flex: 2 }}>{form.skillsProficientAt.join(", ") || "Yet to be filled"}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "70vw",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                    className="link"
                  >
                    <span className="fw-semibold text-muted" style={{ flex: 1 }}>Skills To Learn:</span>
                    <span style={{ flex: 2 }}>{form.skillsToLearn.join(", ") || "Yet to be filled"}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "70vw",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                    className="link"
                  >
                    <span className="fw-semibold text-muted" style={{ flex: 1 }}>Bio:</span>
                    <span style={{ flex: 2 }}>{form.bio || "Yet to be filled"}</span>
                  </div>
                </div>
                <div className="row">
                  <button
                    onClick={handleSubmit}
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    className="w-50 d-flex m-auto text-center align-content-center justify-content-center"
                  >
                    {saveLoading ? <Spinner animation="border" variant="primary" /> : "Submit"}
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
