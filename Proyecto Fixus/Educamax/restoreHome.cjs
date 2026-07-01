const fs = require('fs');
let txt = fs.readFileSync('src/components/Home.jsx', 'utf8');

const imports = `import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wand2, Image as ImageIcon, LayoutTemplate,
  LogOut, Moon, Sun, Settings, BookOpen, Monitor, Heart, FileText 
} from 'lucide-react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import LockerIcon from './LockerIcon';

`;

txt = imports + txt;
fs.writeFileSync('src/components/Home.jsx', txt, 'utf8');
console.log('Restored imports in Home.jsx');
