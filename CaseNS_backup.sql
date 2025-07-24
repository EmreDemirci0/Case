--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_settings (
    id integer NOT NULL,
    key character varying NOT NULL,
    value character varying NOT NULL
);


ALTER TABLE public.app_settings OWNER TO postgres;

--
-- Name: app_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.app_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.app_settings_id_seq OWNER TO postgres;

--
-- Name: app_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.app_settings_id_seq OWNED BY public.app_settings.id;


--
-- Name: item_instances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_instances (
    "currentLevel" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    id integer NOT NULL,
    "itemId" integer,
    progress integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.item_instances OWNER TO postgres;

--
-- Name: item_instances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_instances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_instances_id_seq OWNER TO postgres;

--
-- Name: item_instances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_instances_id_seq OWNED BY public.item_instances.id;


--
-- Name: item_level_translations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_level_translations (
    id integer NOT NULL,
    lang character varying NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    item_level_id integer
);


ALTER TABLE public.item_level_translations OWNER TO postgres;

--
-- Name: item_level_translations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_level_translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_level_translations_id_seq OWNER TO postgres;

--
-- Name: item_level_translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_level_translations_id_seq OWNED BY public.item_level_translations.id;


--
-- Name: item_levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_levels (
    level integer NOT NULL,
    "imageUrl" character varying,
    id integer NOT NULL,
    "itemId" integer
);


ALTER TABLE public.item_levels OWNER TO postgres;

--
-- Name: item_levels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_levels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_levels_id_seq OWNER TO postgres;

--
-- Name: item_levels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_levels_id_seq OWNED BY public.item_levels.id;


--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    name character varying NOT NULL,
    slug character varying NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    email character varying(100) NOT NULL,
    password character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    id integer NOT NULL,
    full_name character varying(50),
    "lastEnergyUpdateAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: app_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_settings ALTER COLUMN id SET DEFAULT nextval('public.app_settings_id_seq'::regclass);


--
-- Name: item_instances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_instances ALTER COLUMN id SET DEFAULT nextval('public.item_instances_id_seq'::regclass);


--
-- Name: item_level_translations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_level_translations ALTER COLUMN id SET DEFAULT nextval('public.item_level_translations_id_seq'::regclass);


--
-- Name: item_levels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_levels ALTER COLUMN id SET DEFAULT nextval('public.item_levels_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_settings (id, key, value) FROM stdin;
3	max_item_level	3
1	max_energy	100
4	progress_per_energy	2
2	energy_regen_minutes	0.5
\.


--
-- Data for Name: item_instances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_instances ("currentLevel", "createdAt", "userId", id, "itemId", progress) FROM stdin;
1	2025-07-24 20:58:32.996889	23	81	1	0
1	2025-07-24 20:58:32.996889	23	82	2	0
1	2025-07-24 20:58:32.996889	23	83	3	0
1	2025-07-24 20:58:32.996889	23	84	4	0
1	2025-07-24 20:58:32.996889	23	85	5	0
1	2025-07-24 20:58:32.996889	23	86	6	0
1	2025-07-24 20:58:32.996889	23	87	7	0
1	2025-07-24 20:58:32.996889	23	88	8	0
\.


--
-- Data for Name: item_level_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_level_translations (id, lang, title, description, item_level_id) FROM stdin;
1	tr	Gümüş Diş	Sade, keskin bir savaş kılıcı.	1
2	en	Silver Fang	Simple, sharp war blade.	1
3	tr	Zümrüt Yürek	Can alıcı darbeler için güçlendirildi.	2
4	en	Emerald Heart	Empowered for deadly strikes.	2
5	tr	Altın Pençe	Kralların kanını döken efsanevi keskinlik.	3
6	en	Golden Claw	Legendary blade that spilled royal blood.	3
7	tr	Ay Parçası	Hafif ve hızlı bir balta.	4
8	en	Moon Shard	Light and fast axe.	4
9	tr	Zümrüt Kesik	Derin yaralar açan büyülü çelik.	5
10	en	Emerald Gash	Magical steel that cuts deep.	5
11	tr	Efsane Yarma	Tek vuruşta kale kapısı deler.	6
12	en	Legend Cleaver	Pierces gates in one blow.	6
13	tr	Gölge Dalı	Temel büyü asası.	7
14	en	Shadow Branch	Basic magic staff.	7
15	tr	Zümrüt Kök	Doğanın gücüyle titreşir.	8
16	en	Emerald Root	Vibrates with nature’s force.	8
17	tr	Altın Kök	Yıldızları yere indirir, zamanı büker.	9
18	en	Golden Root	Brings stars down, bends time.	9
19	tr	Gümüş Şiper	Basit bir koruma aracı.	10
20	en	Silver Shield	Simple protection tool.	10
21	tr	Zümrüt Zırh	Gelen saldırıyı yansıtır.	11
22	en	Emerald Armor	Reflects incoming attacks.	11
23	tr	Altın Duvar	Tanrılar bile geçemez.	12
24	en	Golden Wall	Even gods cannot pass.	12
25	tr	Taş Parçalayıcı	Ağır ve yıkıcı.	13
26	en	Stone Splitter	Heavy and destructive.	13
27	tr	Zümrüt Ezici	Zırhları paramparça eder.	14
28	en	Emerald Crusher	Tears armor apart.	14
29	tr	Altın Hüküm	Dünyayı çatlatır, düşmanları ezer.	15
30	en	Golden Judgment	Shatters world, crushes foes.	15
31	tr	Gümüş Pençe	Hafif ve çevik bir bıçak.	16
32	en	Silver Claw	Light and agile blade.	16
33	tr	Zümrüt Çengel	Derin kesikler için eğik.	17
34	en	Emerald Hook	Curved for deep cuts.	17
35	tr	Altın Yılan	Gölge gibi kayar, kaderi biçer.	18
36	en	Golden Serpent	Glides like shadow, cuts fate.	18
37	tr	Gölge Kesik	Hızlı saldırılar için idealdir.	19
38	en	Shadow Slash	Perfect for swift strikes.	19
39	tr	Zümrüt Fısıltı	Sessiz ama ölümcül.	20
40	en	Emerald Whisper	Silent yet deadly.	20
41	tr	Altın Dilim	Zamanda bile iz bırakır.	21
42	en	Golden Slice	Leaves trace through time.	21
43	tr	Gümüş Sayfalar	Temel büyüleri içerir.	22
44	en	Silver Pages	Contains basic spells.	22
45	tr	Zümrüt Kehanet	Geleceği okur, kaderi değiştirir.	23
46	en	Emerald Prophecy	Reads future, changes fate.	23
47	tr	Altın Kitabe	Evrenin sırlarını fısıldar, gerçekliği ezer.	24
48	en	Golden Codex	Whispers cosmic secrets, crushes truth.	24
\.


--
-- Data for Name: item_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_levels (level, "imageUrl", id, "itemId") FROM stdin;
1	1_1.png	1	1
2	1_2.png	2	1
3	1_3.png	3	1
1	2_1.png	4	2
2	2_2.png	5	2
3	2_3.png	6	2
1	3_1.png	7	3
2	3_2.png	8	3
3	3_3.png	9	3
1	4_1.png	10	4
2	4_2.png	11	4
3	4_3.png	12	4
1	5_1.png	13	5
2	5_2.png	14	5
3	5_3.png	15	5
1	6_1.png	16	6
2	6_2.png	17	6
3	6_3.png	18	6
1	7_1.png	19	7
2	7_2.png	20	7
3	7_3.png	21	7
1	8_1.png	22	8
2	8_2.png	23	8
3	8_3.png	24	8
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (name, slug, id) FROM stdin;
Uzun Kılıç	uzun-kilic	1
Savaş Baltası	savas-baltasi	2
Büyü Asası	buyu-asasi	3
Kalkan	kalkan	4
Savaş Çekici	savas-cekici	5
Eğri Kılıç	egri-kilic	6
Kısa Kılıç	kisa-kilic	7
Büyü Kitabı	buyu-kitabi	8
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (email, password, created_at, id, full_name, "lastEnergyUpdateAt") FROM stdin;
yemre.1268@gmail.com	$2b$10$j1v4A4pEjz1eGEYIMxlrKOFv.YzafNsxVArZbjrqEkwXcaikeAAFa	2025-07-24 20:58:32.956438	23	Emre Demirci	2025-07-24 20:58:32.951
\.


--
-- Name: app_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.app_settings_id_seq', 4, true);


--
-- Name: item_instances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_instances_id_seq', 88, true);


--
-- Name: item_level_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_level_translations_id_seq', 48, true);


--
-- Name: item_levels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.item_levels_id_seq', 24, true);


--
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- Name: app_settings PK_4800b266ba790931744b3e53a74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT "PK_4800b266ba790931744b3e53a74" PRIMARY KEY (id);


--
-- Name: item_instances PK_7fe584bada2ddb497deeaaf18dd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_instances
    ADD CONSTRAINT "PK_7fe584bada2ddb497deeaaf18dd" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: items PK_ba5885359424c15ca6b9e79bcf6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY (id);


--
-- Name: item_level_translations PK_ceaa2fd2f8a33e8e14d7a6e1893; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_level_translations
    ADD CONSTRAINT "PK_ceaa2fd2f8a33e8e14d7a6e1893" PRIMARY KEY (id);


--
-- Name: item_levels PK_d13fd7821b72a943eb32a1ed8d7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_levels
    ADD CONSTRAINT "PK_d13fd7821b72a943eb32a1ed8d7" PRIMARY KEY (id);


--
-- Name: app_settings UQ_975c2db59c65c05fd9c6b63a2ab; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT "UQ_975c2db59c65c05fd9c6b63a2ab" UNIQUE (key);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: items UQ_a30421de0f1836d3e4a8071b2a7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT "UQ_a30421de0f1836d3e4a8071b2a7" UNIQUE (slug);


--
-- Name: item_levels FK_0024f6eaccd6808f7dbed662928; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_levels
    ADD CONSTRAINT "FK_0024f6eaccd6808f7dbed662928" FOREIGN KEY ("itemId") REFERENCES public.items(id) ON DELETE CASCADE;


--
-- Name: item_instances FK_3d5c456c103d0ea1b0fe4809ae5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_instances
    ADD CONSTRAINT "FK_3d5c456c103d0ea1b0fe4809ae5" FOREIGN KEY ("itemId") REFERENCES public.items(id);


--
-- Name: item_level_translations FK_7fe5ba0f4571cd3713aa5f78831; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_level_translations
    ADD CONSTRAINT "FK_7fe5ba0f4571cd3713aa5f78831" FOREIGN KEY (item_level_id) REFERENCES public.item_levels(id) ON DELETE CASCADE;


--
-- Name: item_instances FK_cc2337c317df648487fcdaca6e3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_instances
    ADD CONSTRAINT "FK_cc2337c317df648487fcdaca6e3" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

