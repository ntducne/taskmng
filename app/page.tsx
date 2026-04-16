export default function Home() {
    return (
        <>
            <div className="relative overflow-hidden before:absolute before:top-0 before:start-1/2 before:bg-[url('https://preline.co/assets/svg/examples/polygon-bg-element.svg')] dark:before:bg-[url('https://preline.co/assets/svg/examples-dark/polygon-bg-element.svg')] before:bg-no-repeat before:bg-top before:bg-cover before:size-full before:-z-1 before:transform before:-translate-x-1/2">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
                    <div className="mt-5 max-w-3xl text-center mx-auto">
                        <h1 className="block font-bold text-foreground text-4xl md:text-5xl lg:text-6xl">
                            Welcome to 
                            <span className="bg-clip-text bg-linear-to-tl from-primary to-violet-600 text-transparent">&nbsp;Entidi Site</span>
                        </h1>
                    </div>
                </div>
            </div>
        </>
    )
}