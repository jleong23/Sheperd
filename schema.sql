--
-- PostgreSQL database dump
--

\restrict e81YlYV1LDtqFxpzI0YTEMIxRbcsLg2UnLzyoCT4F4Xym3T7eTat03VNFsPe7vp

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: attendance_status; Type: TYPE; Schema: public; Owner: jleong_23
--

CREATE TYPE public.attendance_status AS ENUM (
    'coming',
    'maybe',
    'not coming'
);


ALTER TYPE public.attendance_status OWNER TO jleong_23;

--
-- Name: kid_status; Type: TYPE; Schema: public; Owner: jleong_23
--

CREATE TYPE public.kid_status AS ENUM (
    'CORE',
    'FRINGE',
    'NP'
);


ALTER TYPE public.kid_status OWNER TO jleong_23;

--
-- Name: add_attendance_for_new_kid(); Type: FUNCTION; Schema: public; Owner: jleong_23
--

CREATE FUNCTION public.add_attendance_for_new_kid() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    w RECORD;
BEGIN
    FOR w IN SELECT DISTINCT week, term, year FROM attendance LOOP
        INSERT INTO attendance(kidid, name, week, term, year)
        VALUES (NEW.id, NEW.name, w.week, w.term, w.year)
        ON CONFLICT DO NOTHING; -- avoid duplicates
    END LOOP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.add_attendance_for_new_kid() OWNER TO jleong_23;

--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: jleong_23
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at() OWNER TO jleong_23;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: jleong_23
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO jleong_23;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: attendance; Type: TABLE; Schema: public; Owner: jleong_23
--

CREATE TABLE public.attendance (
    id integer NOT NULL,
    kidid integer NOT NULL,
    name text,
    week integer NOT NULL,
    term integer DEFAULT 1,
    status public.attendance_status DEFAULT 'maybe'::public.attendance_status,
    reason text,
    photo text,
    year integer DEFAULT EXTRACT(year FROM now()),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    birthday date,
    user_id uuid NOT NULL
);


ALTER TABLE public.attendance OWNER TO jleong_23;

--
-- Name: attendance_backup; Type: TABLE; Schema: public; Owner: jleong_23
--

CREATE TABLE public.attendance_backup (
    id integer,
    kidid integer,
    name text,
    week integer,
    present boolean,
    reason text,
    photo text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    term integer,
    year integer,
    status text
);


ALTER TABLE public.attendance_backup OWNER TO jleong_23;

--
-- Name: attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: jleong_23
--

CREATE SEQUENCE public.attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attendance_id_seq OWNER TO jleong_23;

--
-- Name: attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jleong_23
--

ALTER SEQUENCE public.attendance_id_seq OWNED BY public.attendance.id;


--
-- Name: catchups; Type: TABLE; Schema: public; Owner: jleong_23
--

CREATE TABLE public.catchups (
    catchupid integer NOT NULL,
    kidid integer NOT NULL,
    catchupdate date NOT NULL,
    catchupstarttime time without time zone,
    catchupendtime time without time zone,
    catchuppurpose text,
    catchupcomments text,
    createdat timestamp without time zone DEFAULT now(),
    updatedat timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id uuid
);


ALTER TABLE public.catchups OWNER TO jleong_23;

--
-- Name: catchups_id_seq; Type: SEQUENCE; Schema: public; Owner: jleong_23
--

CREATE SEQUENCE public.catchups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.catchups_id_seq OWNER TO jleong_23;

--
-- Name: catchups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jleong_23
--

ALTER SEQUENCE public.catchups_id_seq OWNED BY public.catchups.catchupid;


--
-- Name: events; Type: TABLE; Schema: public; Owner: jleong_23
--

CREATE TABLE public.events (
    eventid integer NOT NULL,
    eventname text NOT NULL,
    eventstartdate date,
    eventenddate date,
    eventstarttime time without time zone,
    eventendtime time without time zone,
    eventphoto text,
    eventassignedpeople text,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id uuid
);


ALTER TABLE public.events OWNER TO jleong_23;

--
-- Name: events_eventid_seq; Type: SEQUENCE; Schema: public; Owner: jleong_23
--

CREATE SEQUENCE public.events_eventid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_eventid_seq OWNER TO jleong_23;

--
-- Name: events_eventid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jleong_23
--

ALTER SEQUENCE public.events_eventid_seq OWNED BY public.events.eventid;


--
-- Name: kids; Type: TABLE; Schema: public; Owner: jleong_23
--

CREATE TABLE public.kids (
    id integer NOT NULL,
    name text NOT NULL,
    birthday date,
    school text,
    phone text,
    parent_phone text,
    photo text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    parentname character varying(255),
    address text,
    status_code public.kid_status DEFAULT 'NP'::public.kid_status NOT NULL,
    baptised boolean DEFAULT false,
    sunday_regulars boolean DEFAULT false,
    first_call boolean DEFAULT false,
    second_call boolean DEFAULT false,
    first_call_feedback text DEFAULT ''::text,
    second_call_feedback text DEFAULT ''::text,
    user_id integer
);


ALTER TABLE public.kids OWNER TO jleong_23;

--
-- Name: kids_id_seq; Type: SEQUENCE; Schema: public; Owner: jleong_23
--

CREATE SEQUENCE public.kids_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kids_id_seq OWNER TO jleong_23;

--
-- Name: kids_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jleong_23
--

ALTER SEQUENCE public.kids_id_seq OWNED BY public.kids.id;


--
-- Name: notes; Type: TABLE; Schema: public; Owner: jleong_23
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notes OWNER TO jleong_23;

--
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: jleong_23
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notes_id_seq OWNER TO jleong_23;

--
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jleong_23
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: jleong_23
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    user_name character varying(100),
    email character varying(100) NOT NULL,
    group_graduation_year integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO jleong_23;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: jleong_23
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO jleong_23;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jleong_23
--

-- sequence owned by removed as id is now uuid


--
-- Name: attendance id; Type: DEFAULT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.attendance ALTER COLUMN id SET DEFAULT nextval('public.attendance_id_seq'::regclass);


--
-- Name: catchups catchupid; Type: DEFAULT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.catchups ALTER COLUMN catchupid SET DEFAULT nextval('public.catchups_id_seq'::regclass);


--
-- Name: events eventid; Type: DEFAULT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.events ALTER COLUMN eventid SET DEFAULT nextval('public.events_eventid_seq'::regclass);


--
-- Name: kids id; Type: DEFAULT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.kids ALTER COLUMN id SET DEFAULT nextval('public.kids_id_seq'::regclass);


--
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: jleong_23
--

-- default nextval removed as id is now uuid


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (id);


--
-- Name: catchups catchups_pkey; Type: CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.catchups
    ADD CONSTRAINT catchups_pkey PRIMARY KEY (catchupid);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (eventid);


--
-- Name: kids kids_pkey; Type: CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.kids
    ADD CONSTRAINT kids_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_catchups_kid_id; Type: INDEX; Schema: public; Owner: jleong_23
--

CREATE INDEX idx_catchups_kid_id ON public.catchups USING btree (kidid);


--
-- Name: attendance attendance_kidid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_kidid_fkey FOREIGN KEY (kidid) REFERENCES public.kids(id) ON DELETE CASCADE;


--
-- Name: attendance attendance_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: catchups catchups_kid_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.catchups
    ADD CONSTRAINT catchups_kid_id_fkey FOREIGN KEY (kidid) REFERENCES public.kids(id) ON DELETE CASCADE;


--
-- Name: catchups catchups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.catchups
    ADD CONSTRAINT catchups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: events events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: kids kids_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.kids
    ADD CONSTRAINT kids_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notes notes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jleong_23
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict e81YlYV1LDtqFxpzI0YTEMIxRbcsLg2UnLzyoCT4F4Xym3T7eTat03VNFsPe7vp

