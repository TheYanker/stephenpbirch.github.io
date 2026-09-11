/* ══════════════════════════════════════════════════════════════════════════
   PROJECT DATA — the single place to edit projects.
   The home page cards and the detail pages are both built from this list,
   so adding a project here makes it appear in both, in this order.

   Each project:
     slug     unique id; becomes the URL — project.html?p=<slug>
     name     card + page title
     term     e.g. 'Spring 2026'
     status   'Ongoing' (shown green) or 'Completed'
     tags     small pills
     summary  short blurb for the card and the top of the detail page
     sections optional prose blocks:  { title, body: [...], list: [...] }
     media    gallery entries (see below) — leave [] until you have files

   MEDIA ENTRIES — drop files into media/<slug>/ and reference them here:
     { type: 'image', src: 'media/flapping-wing/wing-cad.png',
       caption: 'Wing CAD', wide: true }
     { type: 'video', src: 'media/flapping-wing/bench-test.mp4',
       poster: 'media/flapping-wing/bench-test.jpg', caption: 'Bench test' }
     { type: 'youtube', id: 'dQw4w9WgXcQ', caption: 'Flight footage' }
   `wide: true` makes an item span the full width of the gallery.
   An image whose file is missing shows a labelled placeholder rather than a
   broken icon, so it is safe to list media before the files exist.
   ═════════════════════════════════════════════════════════════════════════ */
const PROJECTS = [
  {
    slug: 'flapping-wing-drone',
    name: 'Flapping Wing Drone',
    term: 'Spring 2026',
    status: 'Ongoing',
    tags: ['Onshape', 'C', '3D Printing', 'Aerodynamics'],
    summary: 'Designing and analyzing a flapping wing drone under the advisement of Professor Mitsunori Denda — biomimetic wing geometry, a 3D-printed actuation mechanism, and a flight control unit written in C.',
    sections: [
      {
        title: 'Overview',
        body: [
          'Designing and analyzing a flapping wing drone under the advisement of Professor Mitsunori Denda. The aircraft takes its cues from insect and small-bird flight, where lift comes from unsteady mechanisms — leading-edge vortices, wake capture, rotational circulation — rather than the steady-state aerodynamics of a fixed wing.',
          'The work spans CAD, structural design for additive manufacturing, and embedded control, with each iteration of the mechanism feeding back into the wing geometry and flapping kinematics.'
        ]
      },
      {
        title: 'What I did',
        list: [
          'Developed CAD models of the wing and actuation mechanism in Onshape.',
          'Investigated biomimetic flight principles and unsteady aerodynamics to inform wing geometry and flapping kinematics.',
          '3D printed wing spars, linkages, and airframe components to iterate rapidly while minimizing structural weight.',
          'Programmed the flight control unit in C to drive actuation timing and stabilize the aircraft across a range of flapping frequencies and angles of attack.'
        ]
      }
    ],
    media: [
      { type: 'image', src: 'media/flapping-wing-drone/mechanism-cad.png', caption: 'Actuation mechanism in Onshape.', wide: true },
      { type: 'image', src: 'media/flapping-wing-drone/wing-cad.png', caption: 'Wing spar and membrane layout.' },
      { type: 'image', src: 'media/flapping-wing-drone/printed-parts.jpg', caption: '3D-printed spars and linkages.' },
      { type: 'video', src: 'media/flapping-wing-drone/bench-test.mp4', caption: 'Bench test of the flapping mechanism.', wide: true }
    ]
  },
  {
    slug: 'ansys-fluid-simulation',
    name: 'Fluid Simulation using ANSYS',
    term: 'Spring 2026',
    status: 'Completed',
    tags: ['ANSYS Fluent', 'Solidworks', 'CFD', 'NACA Airfoils'],
    summary: 'CFD study of several NACA airfoils across a sweep of angles of attack, including transient simulations capturing von Kármán vortex shedding and flow separation.',
    sections: [
      {
        title: 'Overview',
        body: [
          'Modeled several NACA airfoils in Solidworks and imported the geometries into ANSYS for CFD analysis. The goal was to characterize how each section behaves as angle of attack increases — through the linear lift regime and into separation — and to resolve the unsteady wake structures that steady solvers cannot capture.'
        ]
      },
      {
        title: 'What I did',
        list: [
          'Generated meshes for each airfoil at multiple angles of attack, with mesh independence verification.',
          'Ran laminar flow simulations to characterize airfoil aerodynamics across those angles.',
          'Captured von Kármán vortex shedding and flow separation through transient unsteady simulations.'
        ]
      }
    ],
    media: [
      { type: 'image', src: 'media/ansys-fluid-simulation/vortex-shedding.png', caption: 'von Kármán vortex street in the wake.', wide: true },
      { type: 'image', src: 'media/ansys-fluid-simulation/mesh.png', caption: 'Structured mesh around the airfoil.' },
      { type: 'image', src: 'media/ansys-fluid-simulation/pressure-contour.png', caption: 'Pressure contours at high angle of attack.' },
      { type: 'video', src: 'media/ansys-fluid-simulation/transient.mp4', caption: 'Transient velocity field — shedding cycle.', wide: true }
    ]
  },
  {
    slug: 'steel-bear-canister',
    name: 'Steel Bear Canister',
    term: 'Fall 2025',
    status: 'Completed',
    tags: ['Solidworks', 'PrePoMax', 'CalculiX', 'FEA'],
    summary: 'A bear-resistant canister designed in Solidworks and validated in PrePoMax under multiple load cases, with custom meshing parameters for faster, more accurate solves.',
    sections: [
      {
        title: 'Overview',
        body: [
          'Designed a bear canister with multiple geometries, incorporating industry-standard parts in Solidworks. The canister has to survive crushing, impact, and prying loads while staying light enough to carry, which makes it a good exercise in trading wall thickness and geometry against mass.'
        ]
      },
      {
        title: 'What I did',
        list: [
          'Designed the canister across multiple geometries, incorporating industry-standard parts in Solidworks.',
          'Used PrePoMax to quickly generate accurate simulations under many types of loading.',
          'Optimized automatic mesh generation by creating custom meshing parameters and generation techniques.'
        ]
      }
    ],
    media: [
      { type: 'image', src: 'media/steel-bear-canister/cad-render.png', caption: 'Solidworks assembly render.', wide: true },
      { type: 'image', src: 'media/steel-bear-canister/stress-plot.png', caption: 'von Mises stress under crush loading.' },
      { type: 'image', src: 'media/steel-bear-canister/mesh.png', caption: 'Refined mesh at the lid interface.' }
    ]
  },
  {
    slug: 'light-activated-food-dispenser',
    name: 'Light Activated Food Dispenser',
    term: 'Spring 2025',
    status: 'Completed',
    tags: ['Arduino', 'Arduino IDE', 'Mechatronic Engineering'],
    summary: 'An Arduino pet feeder that dispenses on ambient light level, with a user-adjustable portion control panel, an LCD readout, and a geared stepper drive for precision.',
    sections: [
      {
        title: 'Overview',
        body: [
          'Created a photo-detection system using photoresistors and an Arduino to determine the ambient light level, so the feeder dispenses on a daylight cycle rather than a fixed clock. The mechanical side is a geared stepper drive sized for repeatable portions without jamming.'
        ]
      },
      {
        title: 'What I did',
        list: [
          'Built a photo-detection system with photoresistors and an Arduino to read ambient light level.',
          'Built a custom control panel so the user can adjust the amount of food being dispensed.',
          'Integrated an LCD display showing dispensed quantity and feeding instances.',
          'Designed a dispensing system using a stepper motor and gearbox to increase torque and dispensing precision.'
        ]
      }
    ],
    media: [
      { type: 'image', src: 'media/light-activated-food-dispenser/assembly.jpg', caption: 'Assembled dispenser and control panel.', wide: true },
      { type: 'image', src: 'media/light-activated-food-dispenser/wiring.jpg', caption: 'Arduino wiring and photoresistor array.' },
      { type: 'image', src: 'media/light-activated-food-dispenser/lcd.jpg', caption: 'LCD readout of portions dispensed.' },
      { type: 'video', src: 'media/light-activated-food-dispenser/dispensing.mp4', caption: 'Dispensing cycle at a set portion size.', wide: true }
    ]
  }
];
