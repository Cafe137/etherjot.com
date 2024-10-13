export async function createCommentSystem(commentsFeed: string) {
    return `
    <div id="comments"></div>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swarm-comment-system-ui@1.1.1/dist/style.css">
    <script src="https://cdn.jsdelivr.net/npm/swarm-comment-system-ui@1.1.1"></script>
    <script>
        window.SwarmCommentSystem.renderSwarmComments('comments', { approvedFeedAddress: "${commentsFeed}" })
    </script>
    `
}
