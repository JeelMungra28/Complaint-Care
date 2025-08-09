const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config();
require("./config");
const {
  ComplaintSchema,
  UserSchema,
  AssignedComplaint,
  MessageSchema,
} = require("./Schema");
const app = express();
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const GOOGLE_ENABLED = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const MS_ENABLED = Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET);

/**************************************** */
app.use(express.json());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserSchema.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Google OAuth Strategy
if (GOOGLE_ENABLED) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8000/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          let user = await UserSchema.findOne({ $or: [{ googleId: profile.id }, { email }] });
          if (!user) {
            user = await UserSchema.create({
              name: profile.displayName || "Google User",
              email: email || `unknown-${profile.id}@google.local`,
              userType: "Ordinary",
              googleId: profile.id,
              avatar: profile.photos && profile.photos[0] && profile.photos[0].value,
            });
          } else if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

// Microsoft OAuth Strategy
if (MS_ENABLED) {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || "http://localhost:8000/auth/microsoft/callback",
        scope: ["user.read"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0] && profile.emails[0].value;
          let user = await UserSchema.findOne({ $or: [{ microsoftId: profile.id }, { email }] });
          if (!user) {
            user = await UserSchema.create({
              name: profile.displayName || "Microsoft User",
              email: email || `unknown-${profile.id}@microsoft.local`,
              userType: "Ordinary",
              microsoftId: profile.id,
              avatar: profile.photos && profile.photos[0] && profile.photos[0].value,
            });
          } else if (!user.microsoftId) {
            user.microsoftId = profile.id;
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

function redirectWithUser(res, user) {
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    userType: user.userType || "Ordinary",
    avatar: user.avatar || "",
  };
  const payload = Buffer.from(JSON.stringify(safeUser)).toString("base64");
  const redirectUrl = `${FRONTEND_URL}/Login?user=${payload}`;
  return res.redirect(redirectUrl);
}

// Auth routes
if (GOOGLE_ENABLED) {
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/failure" }),
    (req, res) => redirectWithUser(res, req.user)
  );
} else {
  app.get("/auth/google", (req, res) => res.status(501).json({ message: "Google auth not configured" }));
  app.get("/auth/google/callback", (req, res) => res.status(501).json({ message: "Google auth not configured" }));
}

if (MS_ENABLED) {
  app.get("/auth/microsoft", passport.authenticate("microsoft"));
  app.get(
    "/auth/microsoft/callback",
    passport.authenticate("microsoft", { failureRedirect: "/auth/failure" }),
    (req, res) => redirectWithUser(res, req.user)
  );
} else {
  app.get("/auth/microsoft", (req, res) => res.status(501).json({ message: "Microsoft auth not configured" }));
  app.get("/auth/microsoft/callback", (req, res) => res.status(501).json({ message: "Microsoft auth not configured" }));
}

app.get("/auth/failure", (req, res) => res.status(401).send("Authentication failed"));
app.post("/auth/logout", (req, res) => {
  req.logout?.(() => {});
  req.session?.destroy(() => {});
  res.clearCookie("connect.sid");
  res.sendStatus(204);
});
/********************************************** */

/******************message *******************************/
app.post("/messages", async (req, res) => {
  try {
    const { name, message, complaintId } = req.body;
    const messageData = new MessageSchema({
      name,
      message,
      complaintId,
    });
    const messageSaved = await messageData.save();
    res.status(200).json(messageSaved);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

app.get("/messages/:complaintId", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const messages = await MessageSchema.find({ complaintId }).sort(
      "-createdAt"
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
});

/***********for signup user************************************** */

app.post("/SignUp", async (req, res) => {
  try {
    const { name, email, password, phone, userType } = req.body;
    const existing = await UserSchema.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await UserSchema.create({
      name,
      email,
      password: hashedPassword,
      phone,
      userType: userType || "Ordinary",
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

//////////////////////for login user///////////////////
app.post("/Login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "User doesn`t exists" });
  }
  if (!user.password) {
    return res.status(400).json({ message: "Password login not available for this account. Use social login." });
  }
  const isValid = await bcrypt.compare(password, user.password || "");
  if (isValid) {
    res.json(user);
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
});

//////////////////////////for fetching agent in admin portal///////////////
app.get("/AgentUsers", async (req, res) => {
  try {
    const { userType } = req.params;
    const users = await UserSchema.find({ userType: "Agent" });
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////////////////////////for fetching ordinary user in admin portal///////////////
app.get("/OrdinaryUsers", async (req, res) => {
  try {
    const users = await UserSchema.find({ userType: "Ordinary" });
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////////////////////////for fetching ordinary user in admin portal///////////////
app.get("/AgentUsers", async (req, res) => {
  try {
    // const { userType } = req.params;
    const agentUsers = await UserSchema.find({ userType: "Agent" });
    if (agentUsers.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json(agentUsers);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//////////////////displaying agent with id/////////////////
app.get("/AgentUsers/:agentId", async (req, res) => {
  try {
    const { agentId } = req.params;
    const user = await UserSchema.findOne({ _id: agentId });
    if (user.userType === "Agent") {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
////////////for deleting the user from admin portal////////////////
app.delete("/OrdinaryUsers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserSchema.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      await UserSchema.deleteOne({ _id: id });
      await ComplaintSchema.deleteOne({ userId: id });
      return res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

///////////////complaint register by user and its status checking///////////////
app.post("/Complaint/:id", async (req, res) => {
  const UserId = req.params.id;
  try {
    const user = await UserSchema.findById(UserId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      const complaint = new ComplaintSchema(req.body);
      let resultComplaint = await complaint.save();
      res.send(resultComplaint).status(200);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register complaint" });
  }
});

/////////////////for the all complaints made by the single user/////////////
app.get("/status/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await UserSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      const comment = await ComplaintSchema.find({ userId: userId });
      res.json(comment);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

/////////////status of complaint in admin page/////////////////////////////////////////
app.get("/status", async (req, res) => {
  try {
    const complaint = await ComplaintSchema.find();
    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve Complaints" });
  }
});

////////////Assigned complaint by admin//////////////////
app.post("/assignedComplaints", (req, res) => {
  try {
    const assignedComplaint = req.body;
    AssignedComplaint.create(assignedComplaint);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add assigned complaint" });
  }
});

////////////////complaints in agent homepage////////////////////
app.get("/allcomplaints/:agentId", async (req, res) => {
  try {
    const agentId = req.params.agentId;
    console.log(`Fetching complaints for agent: ${agentId}`);

    const complaints = await AssignedComplaint.find({ agentId: agentId });
    console.log(`Found ${complaints.length} assigned complaints`);

    if (complaints.length === 0) {
      return res.json([]);
    }

    // Fetch all complaintIds from the complaints
    const complaintIds = complaints.map((complaint) => complaint.complaintId);

    // Fetch the corresponding complaints with their names and cities
    const complaintDetails = await ComplaintSchema.find({
      _id: { $in: complaintIds },
    });

    console.log(`Found ${complaintDetails.length} complaint details`);

    // Merge the complaint details into the complaints array with clean structure
    const updatedComplaints = complaints.map((complaint) => {
      const complaintDetail = complaintDetails.find(
        (detail) => detail._id.toString() === complaint.complaintId.toString()
      );

      // Return a clean, flat structure
      return {
        complaintId: complaint.complaintId,
        agentId: complaint.agentId,
        status: complaint.status || "pending",
        name: complaintDetail?.name || "Unknown",
        city: complaintDetail?.city || "Unknown",
        state: complaintDetail?.state || "Unknown",
        address: complaintDetail?.address || "Unknown",
        pincode: complaintDetail?.pincode || "Unknown",
        comment: complaintDetail?.comment || "No comment",
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
      };
    });

    res.json(updatedComplaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to get complaints" });
  }
});

////////////////////updating the user profile by admin/////////////////////////////

app.put("/user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, email, phone } = req.body;
    const user = await UserSchema.findByIdAndUpdate(
      _id,
      { name, email, phone },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the user" });
  }
});

////////////////updating the complaint from the agent/////////////////////////////
app.put("/complaint/:complaintId", async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;
    if (!complaintId || !status) {
      return res.status(400).json({ error: "Missing complaintId or status" });
    }

    const updatedComplaint = await ComplaintSchema.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    const assigned = await AssignedComplaint.findOneAndUpdate(
      { complaintId: complaintId },
      { status },
      { new: true }
    );

    if (!updatedComplaint && !assigned) {
      return res.status(404).json({ error: "Complaint not found" });
    }
    res.json(updatedComplaint);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

// Debug endpoint to check database state
app.get("/debug/assigned-complaints", async (req, res) => {
  try {
    const assignedComplaints = await AssignedComplaint.find({});
    const complaints = await ComplaintSchema.find({});
    const users = await UserSchema.find({});

    res.json({
      assignedComplaints: assignedComplaints.length,
      complaints: complaints.length,
      agents: users.filter((u) => u.userType === "agent").length,
      data: {
        assignedComplaints: assignedComplaints.slice(0, 3), // Show first 3
        complaints: complaints.slice(0, 3),
        agents: users.filter((u) => u.userType === "agent").slice(0, 3),
      },
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ error: "Debug failed" });
  }
});

app.listen(PORT, () => console.log(`server started at ${PORT}`));
