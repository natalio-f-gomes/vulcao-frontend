import React from "react"

function GetHeroSection() {
    return (

        <section className="hero">
            <div className="hero-text">
                <p className="hero-eyebrow">New Season Arrivals</p>
                <h1 className="display">
                Find What<br/><em>Moves</em>You.
                </h1>
                <p className="hero-sub">
                Curated collections across fashion, home, and lifestyle.
                Built for people who know what they want — and aren't afraid to get it.
                </p>
                <div className="d-flex flex-wrap gap-2">
                <a href="#" className="btn-primary-custom">Shop Now</a>
                <a href="#" className="btn-outline-custom">Explore</a>
                </div>
            </div>

            <div className="hero-image">
                <div className="hero-image-inner">
                <div className="hero-card">
                    <div className="card-label">Featured</div>
                    <div className="card-title-sm">Merino Wool Coat</div>
                    <div className="card-price">From <strong>$189.00</strong></div>
                </div>
                <div className="hero-card">
                    <div className="card-label">New Drop</div>
                    <div className="card-title-sm">Canvas Tote Set</div>
                    <div className="card-price">From <strong>$54.00</strong></div>
                </div>
                </div>
            </div>
    </section>


    )
}

export default GetHeroSection