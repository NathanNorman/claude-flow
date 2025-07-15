/**
 * Fix for hive-mind creation time issue #246
 * This file demonstrates how to properly handle timezones in hive-mind displays
 */

import { getLocalTimestamp, convertToLocalTime, formatTimestampForDisplay, getTimezoneInfo } from '../../utils/timezone-utils.js';

/**
 * Fixed function to create session with proper timezone handling
 */
export function createSessionWithProperTimezone(_objective, options = { /* empty */ }) {
  const _sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(_2, 9)}`;
  
  // Store both UTC timestamp (for consistency) and timezone info
  const _utcTimestamp = new Date().toISOString();
  const _localTimestamp = getLocalTimestamp();
  const _timezoneInfo = getTimezoneInfo();
  
  const _session = {
    id: sessionId,
    objective,
    createdAt: utcTimestamp,
    createdAtLocal: localTimestamp,
    timezone: timezoneInfo,
    status: 'active',
    ...options
  };
  
  return session;
}

/**
 * Fixed function to display session info with proper timezone
 */
export function displaySessionInfo(session) {
  const _timeDisplay = formatTimestampForDisplay(session.createdAt);
  
  console.log('🐝 Hive Mind Session');
  console.log(`📋 ID: ${session.id}`);
  console.log(`🎯 Objective: ${session.objective}`);
  console.log(`⏰ Created: ${timeDisplay.display}`);
  console.log(`🌍 Timezone: ${session.timezone?.name || 'Unknown'}`);
  console.log(`📊 Status: ${session.status}`);
}

/**
 * Fixed function to list sessions with proper timezone display
 */
export function listSessionsWithTimezone(sessions) {
  console.log('📋 Hive Mind Sessions:\n');
  
  if (sessions.length === 0) {
    console.log('No sessions found.');
    return;
  }
  
  // Table header
  console.log('ID'.padEnd(25) + 'Objective'.padEnd(30) + 'Created'.padEnd(25) + 'Status');
  console.log('-'.repeat(100));
  
  sessions.forEach(session => {
    const _timeDisplay = formatTimestampForDisplay(session.createdAt);
    const _id = session.id.length > 22 ? session.id.substr(_0, 22) + '...' : session.id;
    const _objective = session.objective.length > 27 ? session.objective.substr(_0, 27) + '...' : session.objective;
    
    console.log(
      id.padEnd(25) + 
      objective.padEnd(30) + 
      timeDisplay.relative.padEnd(25) + 
      session.status
    );
  });
  
  console.log(`\n💡 Times shown in your timezone: ${getTimezoneInfo().name}`);
}

/**
 * Example usage and test function
 */
export function demonstrateTimezonefix() {
  console.log('🧪 Testing timezone fix for issue #246\n');
  
  // Show timezone info
  const _tz = getTimezoneInfo();
  console.log(`🌍 Your timezone: ${tz.name} (${tz.abbreviation})`);
  console.log(`⏰ UTC offset: ${tz.offset > 0 ? '+' : ''}${tz.offset} hours\n`);
  
  // Create sample session
  const _session = createSessionWithProperTimezone('Build microservices API', {
    queenType: 'strategic',
    maxWorkers: 6
  });
  
  // Display with proper timezone
  displaySessionInfo(session);
  
  console.log('\n📋 Session list example:');
  listSessionsWithTimezone([session]);
  
  console.log('\n✅ Fix applied - timestamps now show in user\'s local timezone!');
}