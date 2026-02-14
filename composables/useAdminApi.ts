export function useAdminApi() {
    async function getStatsUsers() {
        const response = await fetch('/api/admin/stats/users', {
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

    async function getStatsItems() {
        const response = await fetch('/api/admin/stats/items', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch items stats: ${response.statusText}`);
        }

        return await response.json();
    }

    async function getStatsLists() {
        const response = await fetch('/api/admin/stats/lists', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch lists stats: ${response.statusText}`);
        }

        return await response.json();
    }

    async function getStatsActivity() {
        const response = await fetch('/api/admin/stats/activity', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch activity stats: ${response.statusText}`);
        }

        return await response.json();
    }

    async function getStatsVersions() {
        const response = await fetch('/api/admin/stats/versions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch versions stats: ${response.statusText}`);
        }

        return await response.json();
    }

    async function getUsers() {
        const response = await fetch('/api/admin/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.statusText}`);
        }

        return await response.json();
    }

    async function getUserDetail(id: number) {
        const response = await fetch(`/api/admin/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user detail: ${response.statusText}`);
        }

        return await response.json();
    }

    async function blockUser(id: number, blocked: boolean) {
        const response = await fetch(`/api/admin/users/${id}/block`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ blocked }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update user block status: ${response.statusText}`);
        }

        return await response.json();
    }

    async function getStatsTopItems(month?: string) {
        const params = month ? `?month=${month}` : '';
        const response = await fetch(`/api/admin/stats/top-items${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch top items stats: ${response.statusText}`);
        }

        return await response.json();
    }

    return {
        getStatsUsers,
        getStatsItems,
        getStatsLists,
        getStatsActivity,
        getStatsVersions,
        getUsers,
        getUserDetail,
        getStatsTopItems,
        blockUser,
    }
}
