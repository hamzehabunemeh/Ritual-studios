/* ==========================================================================
   Ritual Studios — site settings
   Everything that may need changing lives here.
   ========================================================================== */
window.RITUAL_CONFIG = {
  /* Booking form → email.
     Get a free access key at https://web3forms.com (enter the email that should
     receive bookings, the key arrives by email) and paste it below.
     To switch the bookings to a different inbox later, generate a new key for
     that email and replace this one. */
  web3formsKey: "",

  instagramHandle: "ritualstudios",
  instagramUrl: "https://www.instagram.com/ritualstudios/",
  instagramDM: "https://www.instagram.com/ritualstudios/",

  mapsUrl: "https://maps.app.goo.gl/66debxw34wgPGRtBA",
  reviewsUrl: "https://maps.app.goo.gl/66debxw34wgPGRtBA",

  /* Google rating — copy the numbers from the studio's Google Maps listing.
     Leave as null to hide the score and show only the reviews button. */
  googleRating: null,        // e.g. 4.9
  googleReviewCount: null,   // e.g. 87

  timeZone: "Asia/Amman"
};

/* Weekly timetable. Days run Saturday → Friday like the studio's own schedule.
   To change the timetable, edit this list only — every page updates. */
window.RITUAL_SCHEDULE = [
  { day: "saturday",  time: "10:00", name: "Vital Breath Movement",   coach: "Layali" },
  { day: "saturday",  time: "11:00", name: "Hips & Abs",              coach: "Sara A." },
  { day: "sunday",    time: "18:30", name: "Circuit 1",               coach: "Lara K." },
  { day: "monday",    time: "10:00", name: "Strength & Conditioning", coach: "Layali" },
  { day: "monday",    time: "18:30", name: "Core & More",             coach: "Sara A." },
  { day: "tuesday",   time: "18:30", name: "Circuit 2",               coach: "Lara K." },
  { day: "wednesday", time: "10:00", name: "Functional Training",     coach: "Layali" },
  { day: "wednesday", time: "18:30", name: "Fusion",                  coach: "Layali" },
  { day: "friday",    time: "11:00", name: "Full Body",               coach: "Sarah H." }
];
window.RITUAL_REST_DAYS = ["thursday"];
