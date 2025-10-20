import { useState } from 'react'
import './App.css'

import * as React from "react"
import { Box, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer } from "@mui/material"
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { BrowserRouter } from "react-router-dom";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import Home from "./components/home.tsx"
import Timeline from "./components/timeline.tsx"
import Users from './components/users.tsx'
import About from './components/about.tsx';

const drawerWidth = 240;

function App() {
  
  const links = [
    "/", "users", "timeline", "about"
  ]
  return (
    <BrowserRouter>
    <div>
      {/* Top bar for the page */}
      <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            USER DASHBOARD
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box"
          }
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
          <Divider />
          <List>
          {["Home", "User", "Timeline", "About"].map(
            (text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <Link to={links[index]}>{text}</Link>
              </ListItemButton>
            </ListItem>
            )
          )}
        </List>
      </Drawer>
    

    </div>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/users" element={<Users />} />
      <Route path="/about" element={<About />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
