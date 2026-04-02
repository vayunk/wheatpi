window.DASHBOARD_DATA = {
  // ── Slideshow Configuration ──
  // mediaType can be 'image', 'video', or 'html'
  // duration is in seconds
  slideshow: [
    {
      mediaType: 'image',
      src: './slide_abstract.png',
      duration: 10,
      caption: 'Welcome to the KCL Robotics Lab'
    },
    {
      mediaType: 'image',
      src: './slide_rover.png',
      duration: 10,
      caption: 'ERC Rover Subsystem Review - Today @ 18:00'
    },
    {
      mediaType: 'image',
      src: './slide_printer.png',
      duration: 10,
      caption: '3D Printers Available Now'
    }
  ],

  // ── Lab Schedule ──
  // Hour and minute (24-hour format)
  schedule: [
    { hour: 10, minute: 0, label: 'Morning CAD Session' },
    { hour: 13, minute: 0, label: 'Lunch Break' },
    { hour: 15, minute: 0, label: 'Electronics Workshop' },
    { hour: 18, minute: 0, label: 'Rover subsystem review' },
    { hour: 19, minute: 30, label: 'CAD help desk' },
    { hour: 21, minute: 0, label: 'Lab closes' }
  ],

  // ── Important Notices ──
  // priority: 'urgent' or 'default'
  notices: [
    {
      title: 'Soldering reminder',
      text: 'Do not leave stations powered overnight.',
      priority: 'urgent'
    },
    {
      title: '3D printer queue',
      text: 'Submit jobs via the Discord form before printing.',
      priority: 'default'
    },
    {
      title: 'PCB workshop',
      text: 'Next Wednesday evening. KiCad basics + board review.',
      priority: 'default'
    }
  ],

  // ── Equipment Status ──
  // state: 'available', 'in-use', 'maintenance'
  equipment: [
    { name: '3D Printer (Prusa)', state: 'available' },
    { name: '3D Printer (Ender)', state: 'in-use' },
    { name: 'Soldering Station 1', state: 'available' },
    { name: 'Soldering Station 2', state: 'in-use' },
    { name: 'Laser Cutter', state: 'maintenance' },
    { name: 'Oscilloscope', state: 'available' }
  ],

  // ── Quick Info ──
  quickInfo: [
    { label: 'WiFi', value: 'eduroam' },
    { label: 'Discord', value: '/kcl-robotics' },
    { label: 'Report Issues', value: '#broken-tools' },
    { label: 'Lab Hours', value: 'Mon – Fri · 09 – 21' }
  ],

  // ── Ticker Messages ──
  tickerMessages: [
    'Welcome to the robotics lab',
    'Keep benches clear after use',
    'Report broken tools in #broken-tools',
    'Respect the 3D printer queue',
    'Prototype boldly, clean up thoroughly'
  ]
};
