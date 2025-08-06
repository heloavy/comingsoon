import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Head from 'next/head';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client outside of component
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Fixed target date: August 7th, 2025, 8:00 AM IST (2:30 AM UTC)
const TARGET_TIMESTAMP = 1754326200000;

const SphereAnimation = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const spheresRef = useRef([]);
  const groupRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    found_us: '',  
    work: ''
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('Submitting...');
    const { name, email, found_us, work } = formData;
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ name, email, found_us, work }]);
      if (error) {
        if (error.code === '23505') {
          setSubmitStatus('This email is already on the waitlist.');
        } else {
          setSubmitStatus('Error: Something went wrong. Please try again.');
        }
      } else {
        setSubmitStatus('Thank you for joining our waitlist!');
        setFormData({
          name: '',
          email: '',
          found_us: '',
          work: ''
        });
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus('');
        }, 2000);
      }
    } catch (error) {
      setSubmitStatus('Error: Something went wrong. Please try again.');
    }
  };
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const targetDate = new Date('2025-08-07T08:00:00+05:30'); // 8 AM IST on August 7th, 2025
      const difference = targetDate - istTime;
      
      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);
  const radii = [
    1, 0.6, 0.8, 0.4, 0.9, 0.7, 0.9, 0.3, 0.2, 0.5,
    0.6, 0.4, 0.5, 0.6, 0.7, 0.3, 0.4, 0.8, 0.7, 0.5,
    0.4, 0.6, 0.35, 0.38, 0.9, 0.3, 0.6, 0.4, 0.2, 0.35,
    0.5, 0.15, 0.2, 0.25, 0.4, 0.8, 0.76, 0.8, 1, 0.8,
    0.7, 0.8, 0.3, 0.5, 0.6, 0.55, 0.42, 0.75, 0.66, 0.6,
    0.7, 0.5, 0.6, 0.35, 0.35, 0.35, 0.8, 0.6, 0.7, 0.8,
    0.4, 0.89, 0.3, 0.3, 0.6, 0.4, 0.2, 0.52, 0.5, 0.15,
    0.2, 0.25, 0.4, 0.8, 0.76, 0.8, 1, 0.8, 0.7, 0.8,
    0.3, 0.5, 0.6, 0.8, 0.7, 0.75, 0.66, 0.6, 0.7, 0.5,
    0.6, 0.35, 0.35, 0.35, 0.8, 0.6, 0.7, 0.8, 0.4, 0.89, 0.3
  ];

  const positions = [
    { x: 0, y: 0, z: 0 },
    { x: 1.2, y: 0.9, z: -0.5 },
    { x: 1.8, y: -0.3, z: 0 },
    { x: -1, y: -1, z: 0 },
    { x: -1, y: 1.62, z: 0 },
    { x: -1.65, y: 0, z: -0.4 },
    { x: -2.13, y: -1.54, z: -0.4 },
    { x: 0.8, y: 0.94, z: 0.3 },
    { x: 0.5, y: -1, z: 1.2 },
    { x: -0.16, y: -1.2, z: 0.9 },
    { x: 1.5, y: 1.2, z: 0.8 },
    { x: 0.5, y: -1.58, z: 1.4 },
    { x: -1.5, y: 1, z: 1.15 },
    { x: -1.5, y: -1.5, z: 0.99 },
    { x: -1.5, y: -1.5, z: -1.9 },
    { x: 1.85, y: 0.8, z: 0.05 },
    { x: 1.5, y: -1.2, z: -0.75 },
    { x: 0.9, y: -1.62, z: 0.22 },
    { x: 0.45, y: 2, z: 0.65 },
    { x: 2.5, y: 1.22, z: -0.2 },
    { x: 2.35, y: 0.7, z: 0.55 },
    { x: -1.8, y: -0.35, z: 0.85 },
    { x: -1.02, y: 0.2, z: 0.9 },
    { x: 0.2, y: 1, z: 1 },
    { x: -2.88, y: 0.7, z: 1 },
    { x: -2, y: -0.95, z: 1.5 },
    { x: -2.3, y: 2.4, z: -0.1 },
    { x: -2.5, y: 1.9, z: 1.2 },
    { x: -1.8, y: 0.37, z: 1.2 },
    { x: -2.4, y: 1.42, z: 0.05 },
    { x: -2.72, y: -0.9, z: 1.1 },
    { x: -1.8, y: -1.34, z: 1.67 },
    { x: -1.6, y: 1.66, z: 0.91 },
    { x: -2.8, y: 1.58, z: 1.69 },
    { x: -2.97, y: 2.3, z: 0.65 },
    { x: 1.1, y: -0.2, z: -1.45 },
    { x: -4, y: 1.78, z: 0.38 },
    { x: 0.12, y: 1.4, z: -1.29 },
    { x: -1.64, y: 1.4, z: -1.79 },
    { x: -3.5, y: -0.58, z: 0.1 },
    { x: -0.1, y: -1, z: -2 },
    { x: -4.5, y: 0.55, z: -0.5 },
    { x: -3.87, y: 0, z: 1 },
    { x: -4.6, y: -0.1, z: 0.65 },
    { x: -3, y: 1.5, z: -0.7 },
    { x: -0.5, y: 0.2, z: -1.5 },
    { x: -1.3, y: -0.45, z: -1.5 },
    { x: -3.35, y: 0.25, z: -1.5 },
    { x: -4.76, y: -1.26, z: 0.4 },
    { x: -4.32, y: 0.85, z: 1.4 },
    { x: -3.5, y: -1.82, z: 0.9 },
    { x: -3.6, y: -0.6, z: 1.46 },
    { x: -4.55, y: -1.5, z: 1.63 },
    { x: -3.8, y: -1.15, z: 2.1 },
    { x: -2.9, y: -0.25, z: 1.86 },
    { x: -2.2, y: -0.4, z: 1.86 },
    { x: -5.1, y: -0.24, z: 1.86 },
    { x: -5.27, y: 1.24, z: 0.76 },
    { x: -5.27, y: 2, z: -0.4 },
    { x: -6.4, y: 0.4, z: 1 },
    { x: -5.15, y: 0.95, z: 2 },
    { x: -6.2, y: 0.5, z: -0.8 },
    { x: -4, y: 0.08, z: 1.8 },
    { x: 2, y: -0.95, z: 1.5 },
    { x: 2.3, y: 2.4, z: -0.1 },
    { x: 2.5, y: 1.9, z: 1.2 },
    { x: 1.8, y: 0.37, z: 1.2 },
    { x: 3.24, y: 0.6, z: 1.05 },
    { x: 2.72, y: -0.9, z: 1.1 },
    { x: 1.8, y: -1.34, z: 1.67 },
    { x: 1.6, y: 1.99, z: 0.91 },
    { x: 2.8, y: 1.58, z: 1.69 },
    { x: 2.97, y: 2.3, z: 0.65 },
    { x: -1.3, y: -0.2, z: -2.5 },
    { x: 4, y: 1.78, z: 0.38 },
    { x: 1.72, y: 1.4, z: -1.29 },
    { x: 2.5, y: -1.2, z: -2 },
    { x: 3.5, y: -0.58, z: 0.1 },
    { x: 0.1, y: 0.4, z: -2.42 },
    { x: 4.5, y: 0.55, z: -0.5 },
    { x: 3.87, y: 0, z: 1 },
    { x: 4.6, y: -0.1, z: 0.65 },
    { x: 3, y: 1.5, z: -0.7 },
    { x: 2.3, y: 0.6, z: -2.6 },
    { x: 4, y: 1.5, z: -1.6 },
    { x: 3.35, y: 0.25, z: -1.5 },
    { x: 4.76, y: -1.26, z: 0.4 },
    { x: 4.32, y: 0.85, z: 1.4 },
    { x: 3.5, y: -1.82, z: 0.9 },
    { x: 3.6, y: -0.6, z: 1.46 },
    { x: 4.55, y: -1.5, z: 1.63 },
    { x: 3.8, y: -1.15, z: 2.1 },
    { x: 2.9, y: -0.25, z: 1.86 },
    { x: 2.2, y: -0.4, z: 1.86 },
    { x: 5.1, y: -0.24, z: 1.86 },
    { x: 5.27, y: 1.24, z: 0.76 },
    { x: 5.27, y: 2, z: -0.4 },
    { x: 6.4, y: 0.4, z: 1 },
    { x: 5.15, y: 0.95, z: 2 },
    { x: 6.2, y: 0.5, z: -0.8 },
    { x: 4, y: 0.08, z: 1.8 }
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 24;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };

    const handleTouchStart = (event) => {
      isDragging = true;
      previousMousePosition = { 
        x: event.touches[0].clientX, 
        y: event.touches[0].clientY 
      };
      event.preventDefault();
    };

    const handleTouchMove = (event) => {
      if (isDragging) {
        const deltaMove = {
          x: event.touches[0].clientX - previousMousePosition.x,
          y: event.touches[0].clientY - previousMousePosition.y
        };

        rotation.y += deltaMove.x * 0.01;
        rotation.x += deltaMove.y * 0.01;

        rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.x));

        previousMousePosition = { 
          x: event.touches[0].clientX, 
          y: event.touches[0].clientY 
        };
      }
      event.preventDefault();
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const handleMouseDown = (event) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        rotation.y += deltaMove.x * 0.01;
        rotation.x += deltaMove.y * 0.01;

        rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.x));

        previousMousePosition = { x: event.clientX, y: event.clientY };
      }

      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spheresRef.current);

      if (intersects.length > 0) {
        const hoveredSphere = intersects[0].object;
        const force = new THREE.Vector3();
        force
          .subVectors(intersects[0].point, hoveredSphere.position)
          .normalize()
          .multiplyScalar(0.2);
        
        if (!hoveredSphere.userData.force) {
          hoveredSphere.userData.force = new THREE.Vector3();
        }
        hoveredSphere.userData.force.copy(force);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    const material = new THREE.MeshLambertMaterial({
      color: "#7F00FF",
      emissive: "purple",
      emissiveIntensity: 0.3
    });
    
    const group = new THREE.Group();
    groupRef.current = group;
    const spheres = [];

    const initY = -25;
    const revolutionRadius = 4;
    const revolutionDuration = 2000;

    positions.forEach((pos, index) => {
      const radius = radii[index];
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(pos.x, initY, pos.z);
      sphere.userData = { 
        originalPosition: { ...pos }, 
        radius,
        animationStart: Date.now() + index * 20,
        force: new THREE.Vector3()
      };
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      spheres.push(sphere);
      group.add(sphere);
    });

    spheresRef.current = spheres;
    scene.add(group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.8);
    spotLight.position.set(14, 24, 30);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight1.position.set(0, -4, 0);
    scene.add(directionalLight1);

    const breathingAmplitude = 0.1;
    const breathingSpeed = 0.002;
    const tempVector = new THREE.Vector3();

    const handleCollisions = () => {
      for (let i = 0; i < spheres.length; i++) {
        const sphereA = spheres[i];
        const radiusA = sphereA.userData.radius;

        for (let j = i + 1; j < spheres.length; j++) {
          const sphereB = spheres[j];
          const radiusB = sphereB.userData.radius;

          const distance = sphereA.position.distanceTo(sphereB.position);
          const minDistance = (radiusA + radiusB) * 1.2;

          if (distance < minDistance) {
            tempVector.subVectors(sphereB.position, sphereA.position);
            tempVector.normalize();

            const pushStrength = (minDistance - distance) * 0.4;
            sphereA.position.sub(tempVector.clone().multiplyScalar(pushStrength));
            sphereB.position.add(tempVector.clone().multiplyScalar(pushStrength));
          }
        }
      }
    };

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const currentTime = Date.now();

      const distance = 24;
      camera.position.x = Math.sin(rotation.y) * Math.cos(rotation.x) * distance;
      camera.position.y = Math.sin(rotation.x) * distance;
      camera.position.z = Math.cos(rotation.y) * Math.cos(rotation.x) * distance;
      camera.lookAt(0, 0, 0);

      spheres.forEach((sphere, i) => {
        const timeSinceStart = currentTime - sphere.userData.animationStart;
        
        if (timeSinceStart < revolutionDuration && timeSinceStart > 0) {
          const progress = timeSinceStart / revolutionDuration;
          const easeOut = 1 - Math.pow(1 - progress, 3);
          
          if (progress < 0.5) {
            const halfProgress = progress * 2;
            sphere.position.y = initY + (revolutionRadius - initY) * easeOut;
            sphere.position.z = sphere.userData.originalPosition.z + 
              Math.sin(halfProgress * Math.PI) * revolutionRadius;
          } else {
            const halfProgress = (progress - 0.5) * 2;
            sphere.position.y = revolutionRadius + (sphere.userData.originalPosition.y - revolutionRadius) * halfProgress;
            sphere.position.z = sphere.userData.originalPosition.z - 
              Math.sin(halfProgress * Math.PI) * revolutionRadius;
          }
        } else if (timeSinceStart >= revolutionDuration) {
          const time = currentTime * breathingSpeed;
          const offset = i * 0.2;
          const breathingY = Math.sin(time + offset) * breathingAmplitude;
          const breathingZ = Math.cos(time + offset) * breathingAmplitude * 0.5;

          const force = sphere.userData.force;
          if (force && force.length() > 0) {
            sphere.position.add(force);
            force.multiplyScalar(0.95);

            if (force.length() < 0.01) {
              force.set(0, 0, 0);
            }
          }

          const originalPos = sphere.userData.originalPosition;
          tempVector.set(
            originalPos.x,
            originalPos.y + breathingY,
            originalPos.z + breathingZ
          );
          sphere.position.lerp(tempVector, 0.05);
        }
      });

      handleCollisions();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      
      spheres.forEach(sphere => {
        sphere.geometry.dispose();
      });
      material.dispose();
      renderer.dispose();
      
      if (mountRef.current) {
        try {
          const canvas = mountRef.current.querySelector('canvas');
          if (canvas) {
            mountRef.current.removeChild(canvas);
          }
        } catch (error) {
          console.error('Error removing canvas:', error);
        }
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden">
      <Head>
      <title>Heloavy | Futuristic & AI-Powered Web & Software Development - Coming Soon</title>
        <meta name="description" content="Heloavy is launching soon: your partner for custom software solutions, futuristic websites, and advanced software with personalized AI integration for both web and applications." />
        <meta name="keywords" content="futuristic software, AI-powered web development, custom software solutions, personalized AI integration, advanced applications, innovative websites, software company, bespoke software, digital transformation, Heloavy, coming soon" />
        <meta property="og:title" content="Heloavy - Futuristic & AI-Powered Web & Software Development" />
        <meta property="og:description" content="Heloavy is building cutting-edge custom and AI-integrated futuristic websites and software for a new era of digital experiences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://heloavy.com" />
        <meta property="og:image" content="https://heloavy.com/preview-image.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#7F00FF" />
        <link rel="canonical" href="https://heloavy.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
          background-color: #fefefe;
          touch-action: manipulation;
        }
        
        .coming-soon-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
          max-width: 800px;
          padding: 0 20px;
          z-index: 20;
          pointer-events: none;
        }
        
        .headline {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 700;
          font-size: clamp(2rem, 6vw, 4.5rem);
          margin: 0;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #000;
          text-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 1rem;
        }
        
        .subtext {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          font-size: clamp(0.9rem, 1.5vw, 1.25rem);
          margin: 0 auto 2rem;
          color: rgba(0, 0, 0, 0.7);
          max-width: 600px;
          line-height: 1.5;
          letter-spacing: -0.01em;
          padding: 0 15px;
        }
        
        .waitlist-btn {
          background: #000;
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 30px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          pointer-events: auto;
          position: relative;
          overflow: hidden;
        }
        
        .waitlist-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        
        .waitlist-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        
        .waitlist-btn:hover::after {
          transform: translateX(100%);
        }
        
        .countdown-timer {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          width: 90%;
          max-width: 400px;
          text-align: center;
        }
        
        .countdown-timer h3 {
          font-size: 0.9rem;
          margin-bottom: 10px;
          color: #333;
          font-weight: 500;
        }
        
        .timer-digits {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        
        .timer-unit {
          text-align: center;
          min-width: 50px;
          flex: 1;
        }
        
        .timer-value {
          font-size: 1.4rem;
          font-weight: 600;
          color: #000;
          margin-bottom: 2px;
        }
        
        .timer-label {
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        
        header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          z-index: 10;
          text-align: center;
        }
        
        .navbar-brand {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 1.25rem;
          color: #000;
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        
        .banner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
        }
        
        .banner-inner {
          position: relative;
          height: 100%;
          width: 100%;
        }
        
        .top-desc {
          position: absolute;
          top: 70px;
          left: 0;
          width: 100%;
          text-align: center;
          z-index: 10;
          padding: 0 15px;
        }
        
        .top-desc h5 {
          font-size: 0.9rem;
          color: rgba(0,0,0,0.8);
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .top-desc h6 {
          font-size: 0.8rem;
          color: rgba(0,0,0,0.6);
          font-weight: 400;
        }
        
        .bottom-desc {
          position: fixed;
          bottom: 20px;
          left: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding: 0 20px;
          z-index: 10;
        }
        
        .left-desc, .right-desc {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          width: 100%;
          max-width: 350px;
          justify-content: center;
        }
        
        .left-desc h1, .right-desc h1 {
          font-size: 1.3rem;
          color: #000;
        }
        
        .desc-inner h5 {
          font-size: 0.9rem;
          font-weight: 500;
          color: rgba(0,0,0,0.9);
        }
        
        .desc-inner h6 {
          font-size: 0.75rem;
          color: rgba(0,0,0,0.6);
        }
        
        .rotated-text {
          display: none;
        }
        
        .text-backdrop {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 800px;
          height: auto;
          min-height: 350px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 15px;
          z-index: 15;
          pointer-events: none;
          padding: 20px;
        }

        /* Modal Styles */
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: modalFadeIn 0.3s ease-out;
          padding: 20px;
        }
        
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(12px);
          }
        }
         
        .modal-content {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 30px;
          max-width: 500px;
          width: 100%;
          max-height: 200vh;
          overflow-y: auto;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }
        
        @keyframes modalSlideIn {
          from {
            transform: translateY(30px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        .modal-header {
          font-family: 'Inter', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: #000;
          text-align: center;
          letter-spacing: -0.02em;
        }
        
        .modal-subheader {
          font-size: 1rem;
          color: rgba(0,0,0,0.7);
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.5;
        }
        
        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #7F00FF;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 3px rgba(127, 0, 255, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 12px center;
          background-repeat: no-repeat;
          background-size: 16px;
          padding-right: 40px;
          appearance: none;
        }
        
        .modal-footer {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          justify-content: flex-end;
        }

        .modal-btn {
          padding: 14px 28px;
          border: none;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-width: 100px;
        }

        .modal-btn.cancel {
          background: rgba(0, 0, 0, 0.05);
          color: #666;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .modal-btn.cancel:hover {
          background: rgba(0, 0, 0, 0.08);
          color: #333;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .modal-btn.submit {
          background: #7F00FF;
          color: white;
          box-shadow: 0 4px 15px rgba(127, 0, 255, 0.3);
        }

        .modal-btn.submit::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .modal-btn.submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(127, 0, 255, 0.4);
          background: #8A2BE2;
        }

        .modal-btn.submit:hover::after {
          transform: translateX(100%);
        }

        .modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .status-message {
          text-align: center;
          margin-top: 20px;
          padding: 12px 16px;
          border-radius: 8px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status-message.success {
          background: rgba(34, 197, 94, 0.1);
          color: #166534;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .status-message.error {
          background: rgba(239, 68, 68, 0.1);
          color: #991b1b;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: rgba(0, 0, 0, 0.4);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(0, 0, 0, 0.05);
          color: rgba(0, 0, 0, 0.7);
        }

        @media (min-width: 768px) {
          .countdown-timer {
            top: 30px;
            left: auto;
            right: 30px;
            transform: none;
            width: auto;
            max-width: none;
            padding: 15px 25px;
          }
          
          .timer-digits {
            gap: 15px;
          }
          
          .timer-unit {
            min-width: 60px;
          }
          
          .timer-value {
            font-size: 1.5rem;
          }
          
          .timer-label {
            font-size: 0.75rem;
          }
          
          .top-desc {
            top: 90px;
            padding: 0;
          }
          
          .top-desc h5 {
            font-size: 1rem;
          }
          
          .top-desc h6 {
            font-size: 0.9rem;
          }
          
          .bottom-desc {
            flex-direction: row;
            justify-content: space-between;
            bottom: 40px;
            padding: 0 40px;
          }
          
          .left-desc, .right-desc {
            max-width: 300px;
            padding: 15px 25px;
          }
          
          .modal-content {
            padding: 40px;
            border-radius: 20px;
          }
          
          .modal-header {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="text-backdrop"></div>

      <div className="countdown-timer">
        <h3>Launching In</h3>
        <div className="timer-digits">
          <div className="timer-unit">
            <div className="timer-value">{timeLeft.days}</div>
            <div className="timer-label">Days</div>
          </div>
          <div className="timer-unit">
            <div className="timer-value">{timeLeft.hours}</div>
            <div className="timer-label">Hours</div>
          </div>
          <div className="timer-unit">
            <div className="timer-value">{timeLeft.minutes}</div>
            <div className="timer-label">Mins</div>
          </div>
          <div className="timer-unit">
            <div className="timer-value">{timeLeft.seconds}</div>
            <div className="timer-label">Secs</div>
          </div>
        </div>
      </div>

      <header>
        <div className="header-inner">
          <a href="#" className="navbar-brand">HELOAVY</a>
        </div>
      </header>

      <section className="banner">
        <div className="banner-inner">
          <div className="top-desc">
            <h5>Futuristic Websites & Software Solutions for Brands & Startups</h5>
            <h6>Seamlessly Integrating Personalized AI | Built by Heloavy</h6>
          </div>
          <div className="bottom-desc">
            <div className="left-desc">
              <h1>◦</h1>
              <div className="desc-inner">
              <h5 className="ai-integration-block">Personalized AI Integration & Smart Automation</h5>
                <h6>Driving Innovation with Data-Driven Insights & Intelligent Systems</h6>
              </div>
            </div>
            <div className="right-desc">
              <h1>∞</h1>
              <div className="desc-inner">
                <h5 className="limitless-experiences-block">Limitless Digital Experiences</h5>
                <h6>Bespoke Software & Advanced Web Solutions by Heloavy</h6>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="coming-soon-container">
        <h1 className="headline">HELLO FUTURE. COMING SOON.</h1>
        <p className="subtext">Custom software, personalized AI, and intelligent web solutions for the digital future.</p>
        <button 
          className="waitlist-btn"
          onClick={() => setIsModalOpen(true)}
        >
          Join Waitlist
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            <div className="modal-header">Join Our Waitlist</div>
            <p className="modal-subheader">Be the first to know when we launch our revolutionary AI-powered software and web development platform.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">How did you hear about us?</label>
                <select
                    name="found_us"
                    value={formData.found_us}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                  <option value="">Select an option</option>
                  <option value="social">Social Media</option>
                  <option value="search">Search Engine</option>
                  <option value="referral">Friend/Colleague</option>
                  <option value="event">Event/Conference</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">What do you do?</label>
                <input
                  type="text"
                  name="work"
                  value={formData.work}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Your profession/role"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="modal-btn cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn submit"
                >
                  Join Waitlist
                </button>
              </div>
              {submitStatus && (
                <div className={`status-message ${submitStatus.includes('Error') ? 'error' : 'success'}`}>
                  {submitStatus}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <span className="rotated-text"></span>

      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full"
        style={{ cursor: 'grab' }}
      />
    </div>
  );
};

export default SphereAnimation;