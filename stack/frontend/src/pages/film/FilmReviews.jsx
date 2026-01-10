import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    FiAlertCircle,
    FiAward,
    FiChevronDown,
    FiClock,
    FiLoader,
    FiMessageSquare,
    FiThumbsDown as FiThumbsDownOutline,
    FiThumbsUp as FiThumbsUpOutline,
} from "react-icons/fi";
import { useReviewInfoQuery } from "../../api/review/useReviewQuery";
import "../../css/filmreviews.css";
import { FaStar } from "react-icons/fa";
import { FaThumbsUp } from "react-icons/fa";
import { FaThumbsDown } from "react-icons/fa";

export default function FilmReviews({ movie }) {
    const { id } = useParams();
    const movieId = movie?.id ?? Number(id);
    const [open, setOpen] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [onlyTopCritic, setOnlyTopCritic] = useState(false);
    const [sentiment, setSentiment] = useState("all"); // all | fresh | rotten
    const [order, setOrder] = useState("desc"); // desc = newest first

    useEffect(() => {
        setOpen(false);
        setShouldFetch(false);
        setOnlyTopCritic(false);
        setSentiment("all");
        setOrder("desc");
    }, [movieId]);

    useEffect(() => {
        if (open) setShouldFetch(true);
    }, [open]);

    const {
        data: reviewsData,
        isLoading,
        isFetching,
        isError,
        error,
    } = useReviewInfoQuery(shouldFetch ? movieId : null);

    const reviews = useMemo(() => {
        if (!reviewsData) return [];
        return Array.isArray(reviewsData) ? reviewsData : [reviewsData];
    }, [reviewsData]);

    const filteredReviews = useMemo(() => {
        let list = reviews;

        if (onlyTopCritic) {
            list = list.filter((r) => String(r.top_critic ?? "").toLowerCase() === "true");
        }

        if (sentiment === "fresh") {
            list = list.filter((r) => String(r.review_type ?? "").toLowerCase() === "fresh");
        } else if (sentiment === "rotten") {
            list = list.filter((r) => String(r.review_type ?? "").toLowerCase() === "rotten");
        }

        const sorted = [...list].sort((a, b) => {
            const da = safeDate(a.review_date);
            const db = safeDate(b.review_date);
            return order === "asc" ? da - db : db - da;
        });

        return sorted;
    }, [onlyTopCritic, order, reviews, sentiment]);

    const subtitle = useMemo(() => {
        if (!shouldFetch) return "Click to load reviews";
        if (isLoading || isFetching) return "Loading reviews…";
        if (isError) {
            return (
                error?.response?.data?.error?.message ||
                error?.message ||
                "Unable to load reviews"
            );
        }
        if (reviews.length === 0) return "No reviews for this film yet";
        if (reviews.length === 1) return "1 review available";
        return `${reviews.length} reviews available`;
    }, [error, isError, isFetching, isLoading, reviews.length, shouldFetch]);

    return (
        <section className="film-reviews glass-card">
            <button
                type="button"
                className={`reviews-toggle ${open ? "is-open" : ""}`}
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-controls="reviews-dropdown"
            >
                <div className="reviews-toggle__main">
                    <span className="reviews-toggle__icon">
                        <FiMessageSquare />
                    </span>
                    <div className="reviews-toggle__text">
                        <span className="reviews-toggle__title">See reviews</span>
                        <small className="reviews-toggle__subtitle">{subtitle}</small>
                    </div>
                </div>
                <span className="reviews-toggle__chevron" aria-hidden>
                    <FiChevronDown />
                </span>
            </button>

            <div
                id="reviews-dropdown"
                className={`reviews-dropdown ${open ? "is-open" : ""}`}
                role="region"
            >
                {!shouldFetch ? (
                    <div className="reviews-empty">
                        <FiMessageSquare aria-hidden />
                        <span>Tap to fetch the latest reviews.</span>
                    </div>
                ) : isLoading || isFetching ? (
                    <div className="reviews-empty">
                        <FiLoader className="spin" aria-hidden />
                        <span>Loading reviews…</span>
                    </div>
                ) : isError ? (
                    <div className="reviews-empty is-error">
                        <FiAlertCircle aria-hidden />
                        <span>{subtitle}</span>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="reviews-empty">
                        <FiMessageSquare aria-hidden />
                        <span>No reviews available.</span>
                    </div>
                ) : (
                    <ul className="reviews-list">
                        <li className="reviews-controls" aria-label="Filtri e ordinamento recensioni">
                            <button
                                type="button"
                                className={`chip-toggle ${onlyTopCritic ? "is-active" : ""}`}
                                onClick={() => setOnlyTopCritic((v) => !v)}
                            >
                                <FiAward />
                                Top critic
                            </button>

                            <div className="chip-group" role="group" aria-label="Sentiment">
                                <button
                                    type="button"
                                    className={`chip-toggle ${sentiment === "all" ? "is-active" : ""}`}
                                    onClick={() => setSentiment("all")}
                                >
                                    Tutti
                                </button>
                                <button
                                    type="button"
                                    className={`chip-toggle ${sentiment === "fresh" ? "is-active" : ""}`}
                                    onClick={() => setSentiment("fresh")}
                                >
                                    <FiThumbsUpOutline />
                                    Fresh
                                </button>
                                <button
                                    type="button"
                                    className={`chip-toggle ${sentiment === "rotten" ? "is-active" : ""}`}
                                    onClick={() => setSentiment("rotten")}
                                >
                                    <FiThumbsDownOutline />
                                    Rotten
                                </button>
                            </div>

                            <button
                                type="button"
                                className="chip-toggle"
                                onClick={() => setOrder((v) => (v === "desc" ? "asc" : "desc"))}
                            >
                                <FiClock />
                                {order === "desc" ? "Newest" : "Oldest"}
                            </button>
                        </li>

                        {filteredReviews.length === 0 ? (
                            <li>
                                <div className="reviews-empty">
                                    <FiMessageSquare aria-hidden />
                                    <span>No reviews match these filters.</span>
                                </div>
                            </li>
                        ) : (
                            filteredReviews.map((review) => (
                                <li key={review.id ?? `${review.movieId}-${review.publisher_name || review.critic_name}`}>
                                    <article className="review-card">
                                        {String(review.top_critic ?? "").toLowerCase() === "true" ? (
                                            <span className="review-card__top-critic" title="Top Critic"><FaStar className="top-critic-star" /> Top Critic</span>
                                        ) : null}
                                        <div className="review-card__head">
                                            <div className="review-card__author">
                                                <span className="review-card__avatar">
                                                    {getInitials(review.critic_name || review.publisher_name || "R")}
                                                </span>
                                                <div>
                                                    <p className="review-card__name">
                                                        {review.critic_name || review.publisher_name || "Anonymous"}
                                                    </p>
                                                    <p className="review-card__meta">
                                                        {review.publisher_name && <span>{review.publisher_name}</span>}
                                                        {review.review_date && (
                                                            <>
                                                                {" • "}
                                                                <span>{formatDate(review.review_date)}</span>
                                                            </>
                                                        )}
                                                        {review.review_type && (
                                                            <>
                                                                {" • "}
                                                                {formatType(review.review_type)}
                                                            </>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            {review.review_score ? (
                                                <span className="review-card__score">{review.review_score}</span>
                                            ) : null}
                                        </div>

                                        {review.review_content ? (
                                            <p className="review-card__content">{review.review_content}</p>
                                        ) : null}
                                    </article>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        </section>
    );
}

function getInitials(name) {
    if (!name) return "R";
    const parts = String(name).trim().split(/\s+/);
    const [a, b] = parts;
    return (a?.[0] || "") + (b?.[0] || "");
}

function formatDate(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatType(value) {
    if (!value) return "";
    const type = String(value).toLowerCase();
    switch (type) {
        case "fresh":
            return <FaThumbsUp aria-hidden className="film-type-thumbs fresh"/>
        case "rotten":
            return <FaThumbsDown aria-hidden className="film-type-thumbs rotten"/>
        default:
            return value;
    }
}

function safeDate(value) {
    const date = new Date(value);
    const ts = date.getTime();
    return Number.isNaN(ts) ? 0 : ts;
}
