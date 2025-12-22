import re
from collections import Counter
from math import log
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

STOPWORDS = set("""
a an the and or but if while is are was were be been being
to of in on for with as by from at into over under
""".split())

SECTION_HEADERS = {
    "skills": ["skills", "technical skills", "tech stack"],
    "experience": ["experience", "work experience", "employment"],
    "projects": ["projects", "project experience"],
    "summary": ["summary", "profile", "objective"]
}

SKILL_SYNONYMS = {
    "js": "javascript",
    "node": "node.js",
    "postgres": "postgresql",
}

def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9+\s./-]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def tokenize(text: str):
    words = re.findall(r"[a-z0-9+./-]+", normalize(text))
    return [w for w in words if w not in STOPWORDS and len(w) >= 2]

def split_sections(resume_text: str) -> dict:
    lines = resume_text.splitlines()
    norm_lines = [normalize(l) for l in lines]

    idx_map = {}
    for i, l in enumerate(norm_lines):
        for sec, aliases in SECTION_HEADERS.items():
            if any(l.strip() == a for a in aliases):
                idx_map[sec] = i

    if not idx_map:
        return {"other": resume_text}

    sorted_secs = sorted(idx_map.items(), key=lambda x: x[1])
    sections = {}
    for j, (sec, start) in enumerate(sorted_secs):
        end = sorted_secs[j + 1][1] if j + 1 < len(sorted_secs) else len(lines)
        sections[sec] = "\n".join(lines[start:end])

    return sections

def extract_keywords_from_jd(jd_text: str, top_n: int = 40):
    tokens = tokenize(jd_text)
    counts = Counter(tokens)

    scored = []
    for w, tf in counts.items():
        importance = tf * log(1 + len(w))
        scored.append((w, importance))

    scored.sort(key=lambda x: x[1], reverse=True)
    keywords = [w for w, _ in scored[:top_n]]
    importance_map = {w: s for w, s in scored[:top_n]}
    return keywords, importance_map

def presence_weighted(resume_sections: dict, keyword: str) -> float:
    weights = {"skills": 1.3, "experience": 1.1, "projects": 1.1, "summary": 1.0, "other": 0.8}
    k = keyword.lower()

    total = 0.0
    for sec, txt in resume_sections.items():
        w = weights.get(sec, 0.8)
        if k in normalize(txt):
            total = max(total, w)  
    return total 

def cosine_role_similarity(resume: str, jd: str) -> float:
    vec = TfidfVectorizer(stop_words="english")
    X = vec.fit_transform([resume, jd])
    sim = cosine_similarity(X[0], X[1])[0][0]
    return max(0.0, min(1.0, float(sim)))

def keyword_stuffing_penalty(resume: str, keywords: list) -> float:
    tokens = tokenize(resume)
    if not tokens:
        return 0.0
    counts = Counter(tokens)
    total = len(tokens)

    density = 0.0
    for k in keywords[:15]:
        density += counts.get(k, 0) / total

    if density <= 0.06:
        return 0.0
    return min(10.0, (density - 0.06) * 200)  

def ats_score(resume: str, jd: str, skills_list: list) -> dict:
    resume_n = normalize(resume)
    jd_n = normalize(jd)

    sections = split_sections(resume)

    keywords, importance = extract_keywords_from_jd(jd, top_n=40)

    cover_hits = 0
    imp_hit_sum = 0.0
    imp_sum = sum(importance.values()) or 1.0

    matched = []
    missing = []

    for k in keywords:
        pw = presence_weighted(sections, k)  # 0, 0.8, 1.0, 1.1, 1.3
        if pw > 0:
            cover_hits += 1
            matched.append(k)
            imp_hit_sum += importance[k] * min(pw / 1.3, 1.0)  #normalize to <= 1
        else:
            missing.append(k)

    coverage = cover_hits / (len(keywords) or 1)
    importance_match = imp_hit_sum / imp_sum

    def norm_skill(s): 
        s = normalize(s)
        return SKILL_SYNONYMS.get(s, s)

    jd_skills = set()
    resume_skills = set()
    for s in skills_list:
        ns = norm_skill(s)
        if ns in jd_n:
            jd_skills.add(ns)
        if ns in resume_n:
            resume_skills.add(ns)

    skills_match = (len(jd_skills & resume_skills) / (len(jd_skills) or 1))

    #role similarity
    role_sim = cosine_role_similarity(resume, jd)

    #penalty
    penalty = keyword_stuffing_penalty(resume, keywords)

    #weighted final score
    raw = (
        35 * coverage +
        30 * importance_match +
        25 * skills_match +
        10 * role_sim
    )
    final = max(0.0, min(100.0, raw - penalty))

    #rank missing by importance
    top_missing = sorted(missing, key=lambda k: importance.get(k, 0), reverse=True)[:10]

    return {
        "ats_score": round(final, 2),
        "breakdown": {
            "coverage": round(coverage, 3),
            "importance_match": round(importance_match, 3),
            "skills_match": round(skills_match, 3),
            "role_similarity": round(role_sim, 3),
            "penalty": round(penalty, 2),
        },
        "matched_keywords": matched[:25],
        "missing_keywords": top_missing,
        "top_keywords_to_add": [
            {"keyword": k, "importance": round(importance.get(k, 0.0), 3)}
            for k in top_missing[:5]
        ],
    }
