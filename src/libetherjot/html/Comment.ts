export async function createCommentSystem(identifier: string, commentsFeed: string) {
    return `
    <div id="comments"></div>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swarm-comment-system-ui@1.1.2/dist/style.css">
    <script src="https://cdn.jsdelivr.net/npm/swarm-comment-system-ui@1.1.2"></script>
    <script>
        window.SwarmCommentSystem.renderSwarmComments('comments', { approvedFeedAddress: "${commentsFeed}", identifier: "${identifier}" })
    </script>
    `
}
