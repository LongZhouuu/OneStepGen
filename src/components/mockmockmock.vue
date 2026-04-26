<template>
  <div>
    <button @click="createMockSession">
      Create Mock Session
    </button>

    <button @click="logCurrentSession">
      Log Current Session
    </button>
  </div>
</template>

<script setup>
const CURRENT_SESSION_KEY = 'onestep-current-session'

function createMockSession() {
  const timestamp = Date.now()

  const mockSession = {
    sessionId: 'session-mock-001',
    inputType: 'text',
    rawInputText: 'Write an essay about climate change',
    uploadedFileMeta: null,
    tasks: [
      {
        id: 'task-mock-001',
        text: 'Write introduction',
        status: 'pending',
        priorityGroup: 'urgent-important',
        order: 1,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: 'task-mock-002',
        text: 'Write body paragraph 1',
        status: 'pending',
        priorityGroup: 'important-not-urgent',
        order: 2,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: 'task-mock-003',
        text: 'Find supporting evidence',
        status: 'pending',
        priorityGroup: 'important-not-urgent',
        order: 3,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: 'task-mock-004',
        text: 'Write conclusion',
        status: 'pending',
        priorityGroup: 'not-urgent-important',
        order: 4,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    reward: 'Fox',
    startedAt: timestamp,
    completedAt: null,
  }

  localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(mockSession))

  console.log('Mock session created:', mockSession)
}

function logCurrentSession() {
  const data = localStorage.getItem(CURRENT_SESSION_KEY)

  if (!data) {
    console.log('No current session found.')
    return
  }

  console.log('Current session:', JSON.parse(data))
}
</script>