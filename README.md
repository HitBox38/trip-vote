# Trip Vote

A collaborative voting application to help groups decide their next travel destination together.

## Features

- **Create Vote Sessions**: Set up a vote with a custom number of participants (2-20)
- **Unique Shareable Links**: Each vote session generates a unique link to invite participants
- **User Join System**: Participants join with a username
- **Interactive Country Selection**: Choose up to 5 countries from a comprehensive list
- **Ranking System**: Participants rank their selected countries by preference
- **Real-time Progress**: See who has voted in real-time
- **Automatic Results**: Results are automatically displayed when all participants have voted
- **Points-based Scoring**: Countries are scored based on rankings (1st = 5pts, 2nd = 4pts, etc.)

## Tech Stack

- **Next.js 15**: App Router with Server Components
- **React 19**: Latest features including `useActionState`
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern, responsive styling
- **shadcn/ui**: Beautiful, accessible UI components
- **Server Actions**: Progressive enhancement with form handling
- **Zod**: Schema validation (client & server)
- **Convex**: Real-time database with automatic sync across devices
- **Zustand**: Local state management for UI interactions

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd trip-vote
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up Convex:

```bash
# Initialize Convex and create an account
npx convex dev

# This will:
# - Create a new Convex project
# - Generate the .env.local file with NEXT_PUBLIC_CONVEX_URL
# - Deploy your schema and functions
# - Start the Convex development server
```

4. Run the Next.js development server (in a separate terminal):

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

**Note**: Keep both the Convex dev server (`npx convex dev`) and Next.js dev server (`pnpm dev`) running during development.

## How It Works

### 1. Create a Vote Session

- Visit the home page
- Enter the number of participants (2-20)
- Click "Create Vote Session"
- You'll be redirected to a unique vote session URL

### 2. Share the Link

- Share the vote session URL with your group
- Each participant can join by entering their username
- The session tracks how many people have joined

### 3. Vote for Destinations

- Once joined, participants are taken to the voting interface
- Select up to 5 countries from the list
- Rank your selections from most to least preferred
- Use the arrow buttons to reorder countries
- Submit your vote when ready

### 4. Wait for Results

- After submitting, participants enter a waiting room
- See real-time progress of who has voted
- The page automatically refreshes to check for updates

### 5. View Results

- When all participants have voted, results are automatically displayed
- Countries are ranked by total points
- Points system: 1st choice = 5pts, 2nd = 4pts, 3rd = 3pts, 4th = 2pts, 5th = 1pt
- See the top 3 destinations highlighted
- View complete rankings for all countries

## Project Structure

```
trip-vote/
├── app/
│   ├── actions.ts              # Server Actions for forms
│   ├── providers.tsx           # Convex provider setup
│   ├── page.tsx                # Home page
│   ├── vote/
│   │   └── [id]/
│   │       ├── page.tsx        # Join session page
│   │       ├── voting/
│   │       │   └── page.tsx    # Voting interface
│   │       ├── waiting/
│   │       │   └── page.tsx    # Waiting room
│   │       └── results/
│   │           └── page.tsx    # Results page
│   └── not-found.tsx           # 404 page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── create-vote-form.tsx    # Create vote form
│   ├── join-vote-form.tsx      # Join vote form
│   ├── session-info.tsx        # Real-time session display
│   ├── voting-interface.tsx    # Country selection & ranking
│   ├── waiting-room.tsx        # Real-time waiting room
│   └── results-display.tsx     # Real-time results
├── convex/
│   ├── schema.ts               # Convex database schema
│   ├── sessions.ts             # Session mutations & queries
│   ├── participants.ts         # Participant mutations & queries
│   └── votes.ts                # Vote mutations & queries
├── lib/
│   ├── voting-store.ts         # Zustand store for local state
│   ├── countries.ts            # Country list and utilities
│   └── utils.ts                # Utility functions
└── README.md
```

## Key Implementation Details

### Server Actions

The app uses Next.js 15 Server Actions for all form submissions:

- `createVote`: Creates a new vote session
- `joinVote`: Adds a participant to a session
- `submitVotes`: Records a participant's country selections

### Progressive Enhancement

All forms work without JavaScript enabled:

- Server-side validation with Zod
- Proper redirects after form submission
- Graceful error handling

### State Management

- **Convex**: Server-side database for all persistent data (sessions, participants, votes)
- **Zustand**: Client-side state for UI interactions (country selection, ranking)
- Automatic real-time sync between all participants
- No manual state synchronization needed

### Real-time Updates

- Convex provides automatic real-time synchronization
- No manual polling or WebSockets needed
- Changes instantly reflect across all devices
- Optimistic updates for better UX

## Production Considerations

For production deployment with Convex:

1. **Convex Production Deployment**

   ```bash
   # Deploy to production
   npx convex deploy

   # Update your environment variables
   # Set NEXT_PUBLIC_CONVEX_URL to your production URL
   ```

2. **Environment Variables**
   - Set `NEXT_PUBLIC_CONVEX_URL` in your hosting platform (Vercel, etc.)
   - Get the URL from your Convex dashboard

3. **Session Expiry**: Add scheduled functions for cleanup
   - Use Convex scheduled functions to clean old sessions
   - Add TTL logic to automatically delete expired votes

4. **Authentication**: Add user authentication
   - Use Convex Auth or integrate Clerk/NextAuth
   - Secure creator access with proper auth checks
   - Track user vote history

5. **Analytics**: Add tracking for insights
   - Popular countries and voting patterns
   - Session completion rates
   - User engagement metrics

6. **Rate Limiting**: Prevent abuse
   - Implement rate limiting in Convex mutations
   - Add request throttling per user/IP
   - Monitor and alert on suspicious activity

7. **Scaling**: Convex handles scaling automatically
   - No infrastructure management needed
   - Automatic horizontal scaling
   - Built-in CDN and edge caching

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
