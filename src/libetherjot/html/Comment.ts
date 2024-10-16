export async function createCommentContainer() {
    return `
    <div id="comments"></div>
    `
}

export async function createCommentScripts(identifier: string, commentsFeed: string) {
    return `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swarm-comment-system-ui@1.1.6/dist/style.css">
    <script src="https://cdn.jsdelivr.net/npm/swarm-comment-system-ui@1.1.6"></script>
    <script>
        window.SwarmCommentSystem.renderSwarmComments('comments', { approvedFeedAddress: "${commentsFeed}", identifier: "${identifier}" })
    </script>
    `
}
