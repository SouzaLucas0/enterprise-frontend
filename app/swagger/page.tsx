export default function Swagger() {
    return (
        <section className="w-full h-full">
            <div>
                <iframe
                    src={'http://localhost:4000/docs'}
                    title="Web Page Viewer"
                    className="w-full min-h-screen"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
            </div>
        </section>
    )
}