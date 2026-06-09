export function useAdminApi() {
    async function getStatsUsers(month?: string) {
        const params = month ? `?month=${month}` : '';
        const response = await fetch(`/api/admin/stats/users${params}`, {
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

    async function getStatsItems(month?: string) {
        const params = month ? `?month=${month}` : '';
        const response = await fetch(`/api/admin/stats/items${params}`, {
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

    async function getStatsLists(month?: string) {
        const params = month ? `?month=${month}` : '';
        const response = await fetch(`/api/admin/stats/lists${params}`, {
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

    async function getStatsActivity(month?: string) {
        const params = month ? `?month=${month}` : '';
        const response = await fetch(`/api/admin/stats/activity${params}`, {
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

    async function getStatsVersions(month?: string) {
        const params = month ? `?month=${month}` : '';
        const response = await fetch(`/api/admin/stats/versions${params}`, {
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

    async function getUserDetail(id: number, month?: string) {
        const params = month ? `?month=${month}` : '';
        const response = await fetch(`/api/admin/users/${id}${params}`, {
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

    async function getStatsSpend(month?: string) {
        const params = month ? `?month=${month}` : '';
        const response = await fetch(`/api/admin/stats/spend${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch spend stats: ${response.statusText}`);
        }

        return await response.json();
    }

    async function getEmails(params: {
        status?: string
        type?: string
        date_from?: string
        date_to?: string
        per_page?: number
        limit?: number
    } = {}) {
        const query = new URLSearchParams()
        if (params.status) query.set('status', params.status)
        if (params.type) query.set('type', params.type)
        if (params.date_from) query.set('date_from', params.date_from)
        if (params.date_to) query.set('date_to', params.date_to)
        if (params.per_page) query.set('per_page', String(params.per_page))
        if (params.limit) query.set('limit', String(params.limit))

        const qs = query.toString()
        const response = await fetch(`/api/admin/emails${qs ? '?' + qs : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch emails: ${response.statusText}`)
        }

        return await response.json()
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
        getStatsSpend,
        blockUser,
        getEmails,
    }
}
