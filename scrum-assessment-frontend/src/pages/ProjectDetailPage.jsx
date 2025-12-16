import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';

import { projectApi } from '../api/project';

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [smmLevels, setsmmLevels] = useState([]);
  const [goalsData, setGoalsData] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const [calculationMessage, setCalculationMessage] = useState(null);
  const [error, setError] = useState(null);

  // ---------------------- FETCH BACKEND DATA ----------------------
  const fetchProject = async () => {
    setReloading(true);
    setLoading(true);
    setError(null);
    setCalculationMessage(null);

    try {
      const data = await projectApi.getProjectDetail(projectId);
      console.log("Fetched project data:", data);

      if (!data.project_data) throw new Error("Project not found");

      setProject({
        id: data.project_data.id,
        projectName: data.project_data.name,
        description: data.project_data.description,
        createdAt: data.project_data.created_at,
        updatedAt: data.project_data.updated_at,
        moderatorName: data.project_data.moderator?.fullname || "Unknown",
        moderatorEmail: data.project_data.moderator?.email || "Unknown",
        status: data.project_data.sheet?.fill_form_status ? "active" : "inactive"
      });

      setsmmLevels(
        data.level_scores?.map(i => ({
          level: i.level,
          goals: i.goals,
          kpaRating: i.kpaRating,
          interpretation: i.interpretation
        })) || []
      );

      setGoalsData(
        data.group_scores?.map(i => ({
          goal: i.goal,
          objectives: i.objectives,
          totalKPA: i.totalKPA,
          interpretation: i.interpretation
        })) || []
      );

      setMembers(
        data.project_members?.map((name, index) => ({
          id: index,
          name,
          role: "Member",
          joinDate: new Date().toISOString()
        })) || []
      );

    } catch (err) {
      setError(err.message || "Failed to fetch data.");
    } finally {
      setReloading(false);
      setLoading(false);
    }
  };

  // ---------------------- CALCULATE ----------------------
  const handleCalculate = async () => {
    setCalculating(true);
    setCalculationMessage(
      "Calculation is in progress. You can refresh the page after a moment to see the updated results."
    );

    try {
      await projectApi.calculateProject(projectId);

    } catch (err) {
      console.error("Calculation failed:", err);
    } finally {
      setCalculating(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };
  
  const getRatingColor = (rating) => {
    const p = parseFloat(rating);
    if (p >= 86) return 'success';
    if (p >= 51) return 'success';
    if (p >= 16) return 'warning';
    return 'error';
  };

  const getInterpretationColor = (interpretation) => {
    switch (interpretation) {
      case 'Fully Achieved': return 'success';
      case 'Largely Achieved': return 'primary';
      case 'Partially Achieved': return 'warning';
      case 'Not Achieved': return 'error';
      default: return 'default';
    }
  };

  // ---------------------- LOADING ----------------------
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // ---------------------- ERROR ----------------------
  if (error || !project) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Project not found"}</Alert>
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/projects')}>
          Back
        </Button>
      </Container>
    );
  }

  // ---------------------- MAIN PAGE ----------------------
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        
        {/* LEFT */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/projects')}>
            Back
          </Button>

          <Typography variant="h4" fontWeight="bold">{project.projectName}</Typography>
          <Chip label={project.status} color={getStatusColor(project.status)} size="small" />
        </Box>

        {/* RIGHT BUTTONS */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          
          {/* Reload */}
          <Button
            variant="outlined"
            startIcon={reloading ? <CircularProgress size={16} /> : <RefreshIcon />}
            onClick={fetchProject}
            disabled={reloading}
          >
            {reloading ? "Refreshing..." : "Reload"}
          </Button>

          {/* Calculate */}
          <Button
            variant="contained"
            color="secondary"
            startIcon={calculating ? <CircularProgress size={16} /> : <CalculateIcon />}
            onClick={handleCalculate}
            disabled={calculating}
          >
            {calculating ? "Calculating..." : "Calculate"}
          </Button>

          {/* Edit */}
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/edit-project/${project.id}`)}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* CALCULATION ALERT */}
      {calculationMessage && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {calculationMessage}
        </Alert>
      )}

      <Grid container spacing={4}>

        {/* LEFT COLUMN */}
        <Grid item xs={12} md={8}>

          {/* Description */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                <DescriptionIcon sx={{ mr: 1 }} color="primary" />
                Project Description
              </Typography>
              <Typography>{project.description}</Typography>
            </CardContent>
          </Card>

          {/* Goals Breakdown */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>

              <Typography variant="h6" sx={{ mb: 1 }}>
                <AssessmentIcon sx={{ mr: 1 }} color="primary" />
                Goals & Objectives Breakdown
              </Typography>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                      <TableCell>Goal</TableCell>
                      <TableCell>Objective</TableCell>
                      <TableCell>KPA</TableCell>
                      <TableCell>Total KPA</TableCell>
                      <TableCell>Interpretation</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {goalsData.map((item, index) => (
                      <React.Fragment key={index}>
                        {item.objectives.map((obj, i) => (
                          <TableRow key={i}>

                            {/* Goal (rowspan) */}
                            {i === 0 && (
                              <TableCell rowSpan={item.objectives.length} sx={{ fontWeight: "bold" }}>
                                {item.goal}
                              </TableCell>
                            )}

                            <TableCell>{obj.objective}</TableCell>
                            <TableCell>{obj.kpa}</TableCell>

                            {/* Total KPA */}
                            {i === 0 && (
                              <TableCell rowSpan={item.objectives.length} align="center">
                                {item.totalKPA}
                              </TableCell>
                            )}

                            {/* Interpretation */}
                            {i === 0 && (
                              <TableCell rowSpan={item.objectives.length}>
                                {item.interpretation}
                              </TableCell>
                            )}

                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </CardContent>
          </Card>

                    {/* SMM Level Table */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>

              <Typography variant="h6" sx={{ mb: 1 }}>
                <AssessmentIcon sx={{ mr: 1 }} color="primary" />
                Maturity Level
              </Typography>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                      <TableCell>Level</TableCell>
                      <TableCell>Goals</TableCell>
                      <TableCell align="center">KPA Rating</TableCell>
                      <TableCell>Interpretation</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {smmLevels.map((level, i) => (
                      <TableRow key={i}>
                        <TableCell>{level.level}</TableCell>

                        <TableCell>
                          {level.goals.map((g, index) => (
                            <Typography key={index}>• {g}</Typography>
                          ))}
                        </TableCell>

                        <TableCell align="center">
                          <Chip
                            label={`${level.kpaRating}%`}
                            size="small"
                            color={getRatingColor(level.kpaRating)}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip label={level.interpretation} size="small" color={getInterpretationColor(level.interpretation)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </CardContent>
          </Card>

          {/* Members */}
          <Card elevation={2}>
            <CardContent>

              <Typography variant="h6" sx={{ mb: 1 }}>
                <GroupIcon sx={{ mr: 1 }} color="primary" />
                Project Members ({members.length})
              </Typography>

              <List>
                {members.map((member, i) => (
                  <React.Fragment key={i}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar><PersonIcon /></Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={member.name}
                      />
                    </ListItem>

                    {i < members.length - 1 && <Divider variant="inset" />}
                  </React.Fragment>
                ))}
              </List>

            </CardContent>
          </Card>

        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={4}>

          {/* Moderator Info */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>

              <Typography variant="h6" sx={{ mb: 1 }}>
                <PersonIcon sx={{ mr: 1 }} color="primary" />
                Project Moderator
              </Typography>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48 }}><PersonIcon /></Avatar>

                <Box>
                  <Typography variant="h6">{project.moderatorName}</Typography>
                  <Typography color="text.secondary">{project.moderatorEmail}</Typography>
                </Box>
              </Box>

            </CardContent>
          </Card>

          {/* Project Details */}
          <Card elevation={2}>
            <CardContent>

              <Typography variant="h6" sx={{ mb: 1 }}>
                <CalendarIcon sx={{ mr: 1 }} color="primary" />
                Project Details
              </Typography>

              <Typography variant="body2" color="text.secondary">Created</Typography>
              <Typography>{new Date(project.createdAt).toLocaleDateString()}</Typography>

              <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">Updated</Typography>
              <Typography>{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : "-"}</Typography>

              <Typography variant="body2" sx={{ mt: 2 }} color="text.secondary">Status</Typography>
              <Chip label={project.status} size="small" color={getStatusColor(project.status)} />

            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </Container>
  );
};

export default ProjectDetailPage;
