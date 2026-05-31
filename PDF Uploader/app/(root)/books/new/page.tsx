import UploadForm from "@/components/UploadForm";

const Page = () => {
    return (
        <main className="new-book">
            <section className="flex flex-col gap-5 text-center">
                <h1 className="page-title-xl">Add New Knowledge</h1>
                <p className="subtitle">Upload a document to capture expert knowledge as an interactive AI conversation</p>
            </section>

            <UploadForm />
        </main>
    )
}

export default Page
