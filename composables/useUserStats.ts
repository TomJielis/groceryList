export function useUserStats() {
    async function getStats(month?: string) {
        const params = month ? `?month=${month}` : '';
        const response = await fetch(`/api/user/stats${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user stats: ${response.statusText}`);
        }

        return await response.json();
    }

    return {
        getStats,
    }
}
