// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Script.sol";
import {PinkyPromise} from "src/PinkyPromise.sol";
import {HexStrings} from "src/utils/HexStrings.sol";

uint16 constant signeeHeight = 40;

contract CreateExamplesScript is Script {
    PinkyPromise pp = PinkyPromise(vm.envAddress("PINKY_PROMISE_ADDRESS"));

    uint256 pk1 = vm.envUint("DEMO_PK1");
    uint256 pk2 = vm.envUint("DEMO_PK2");
    uint256 pk3 = vm.envUint("DEMO_PK3");

    function run() external {
        // ex1();
        // ex2();
        // ex3();
        // ex4();
        // ex5();
        // ex6();
        // ex7();

        exampleCertificateOfAchievement();
        exampleDaoPartnershipAgreement();
        exampleCivilPartnershipAgreement();
        exampleArtistsCollab();
        exampleManifesto();
        exampleBet();
        examplePersonalPledge();
        exampleCommunityContributionAgreement();
    }

    function broadcastPromise(uint256 as_, PinkyPromise.PromiseData memory data, address[] memory addresses)
        public
        returns (uint256 id)
    {
        vm.startBroadcast(as_);
        id = pp.newPromise(data, addresses);
        vm.stopBroadcast();
    }

    function broadcastSign(uint256 as_, uint256 id) public {
        vm.startBroadcast(as_);
        pp.sign(id);
        vm.stopBroadcast();
    }

    function exampleCertificateOfAchievement() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"Certificate of achievement";
        // forgefmt: disable-start
        data.body =
            unicode"This document certifies that Nofre Aguirre has successfully completed the DAO coordination fundamentals course presented by Guild Edu.\n"
            unicode"\n"
            unicode"Date: 14/03/2023\n"
            unicode"Certificate ID: 820-2768–M\n"
            unicode"\n"
            unicode"In recognition of the exceptional dedication and outstanding performance demonstrated throughout the course, we are proud to award this certificate of achievement.\n"
            unicode"\n"
            unicode"Signed by\n"
            unicode"Instructor name: Gordon Söderström\n"
            unicode"Student name: Nofre Aguirre\n"
            unicode"\n"
            unicode"This digital certificate is verifiable at guildeducation.org";
        // forgefmt: disable-end

        data.height = 892;
        data.color = PinkyPromise.PromiseColor.Electric;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        broadcastPromise(pk1, data, addrs);
    }

    function exampleDaoPartnershipAgreement() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"DAO Partnership Agreement";
        // forgefmt: disable-start
        data.body =
            unicode"This Partnership Agreement (the “Agreement”) is entered into as of 1st of February, 2023, by and between DedeDAO (“DAO1”), and 0x Studios (“DAO2”), collectively referred to as the “Parties.”"
            unicode"\n"
            unicode"WHEREAS, DAO1 is a decentralized autonomous organization focused on the research and application of AI technologies. WHEREAS, DAO2 is a decentralized autonomous organization focused on cryptographic algorithms and cybersecurity.\n"
            unicode"\n"
            unicode"WHEREAS, both Parties desire to enter into a collaborative partnership to leverage their respective strengths, resources, and expertise for mutual benefit and the advancement of their respective missions.\n"
            unicode"\n"
            unicode"NOW, THEREFORE, in consideration of the mutual covenants and promises set forth herein, the Parties agree as follows:\n"
            unicode"\n"
            unicode"## 1. Purpose of the Partnership\n"
            unicode"\n"
            unicode"The purpose of this Agreement is to establish a framework for collaboration between the Parties to explore, develop, and implement mutually beneficial projects, initiatives, and activities that align with their respective missions and objectives.\n"
            unicode"\n"
            unicode"## 2. Scope of Collaboration\n"
            unicode"\n"
            unicode"The Parties may collaborate on various projects and initiatives, including, but not limited to:\n"
            unicode"a. Joint research and development efforts in areas of shared interest; b. Sharing of resources, including data, technology, and expertise; c. Co-hosting events, workshops, and educational programs; d. Joint marketing and promotional activities; e. Collaborative fundraising and grant proposals; f. Any other projects or initiatives that the Parties agree to pursue jointly.\n"
            unicode"\n"
            unicode"## 3. Governance and Decision-Making\n"
            unicode"\n"
            unicode"a. The Parties shall establish a joint working group (the “Working Group”) to oversee and manage the collaboration. b. The Working Group will be composed of equal representation from both Parties. c. Decisions by the Working Group shall be made by consensus or by a majority vote of its members, as determined by the Parties. d. The Working Group shall meet at regular intervals, as agreed upon by the Parties, to discuss ongoing and potential collaborative projects and initiatives.\n"
            unicode"\n"
            unicode"## 4. Miscellaneous\n"
            unicode"\n"
            unicode"a. This Agreement shall be governed by and construed in accordance with the laws of EU Jurisdiction. b. Any disputes arising under or in connection with this Agreement shall be resolved through good-faith negotiations or, if necessary, binding arbitration in accordance with the rules of the European Centre of Arbitration and Mediation. c. This Agreement may be amended only by a written instrument signed by both Parties. d. This Agreement constitutes the entire understanding of the Parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, representations, and understandings, whether oral or written.\n"
            unicode"\n"
            unicode"IN WITNESS WHEREOF, the Parties, by their duly authorized representatives, have signed this Agreement as of the date first above written.\n"
            unicode"\n"
            unicode"Signatures:";
        // forgefmt: disable-end

        data.height = 2276;
        data.color = PinkyPromise.PromiseColor.Solemn;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        broadcastPromise(pk1, data, addrs);
    }

    function exampleCivilPartnershipAgreement() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"Civil Partnership Agreement";
        // forgefmt: disable-start
        data.body = 
            unicode"This Civil Partnership Agreement (the “Agreement”) is entered into as of 24-01-2023 by and between Mathilda Balliol (“Partner 1”) and João Earle (“Partner 2”), collectively referred to as the “Partners.”\n"
            unicode"\n"
            unicode"Both Partner 1 and Partner 2, are committed to sharing their lives together in a loving and supportive relationship;\n"
            unicode"WHEREAS, the Partners wish to enter into this Agreement to define their rights and obligations to one another and to provide for the management of their joint property, financial affairs, and future responsibilities;\n"
            unicode"NOW, THEREFORE, in consideration of the mutual covenants and promises set forth herein, the Partners agree as follows:\n"
            unicode"\n"
            unicode"## 1. Contributions and Responsibilities\n"
            unicode"\n"
            unicode"The Partners agree to contribute to the support of one another, both emotionally and financially, and to share in the responsibilities of their household, including, but not limited to:\n"
            unicode"a. Providing for their joint living expenses; b. Contributing to the maintenance and improvement of their shared residence; c. Participating in the care and upbringing of any children they may have or adopt; d. Supporting one another in their personal, educational, and professional pursuits.\n"
            unicode"\n"
            unicode"## 2. Joint Property and Financial Affairs\n"
            unicode"\n"
            unicode"a. The Partners agree to maintain a joint bank account for the deposit of their earnings and the payment of their joint expenses. b. All property acquired by either Partner during the term of this Agreement, including real estate, personal property, and financial assets, shall be considered joint property, unless otherwise agreed in writing by the Partners. c. Each Partner shall be responsible for managing their own separate property, including any property acquired prior to the commencement of their partnership, and any gifts or inheritances received during the partnership.\n"
            unicode"\n"
            unicode"## 3. Termination of Partnership\n"
            unicode"\n"
            unicode"a. This Agreement shall continue in effect until terminated by mutual consent of the Partners, by the death of either Partner, or by the dissolution of the partnership under applicable law. b. In the event of the dissolution of the partnership, the Partners agree to divide their joint property, assets, and liabilities in accordance with the principles of fairness and equity, taking into account their respective contributions and needs. c. The Partners may agree to enter into a separate written agreement or seek professional assistance to address the division of their joint property, custody of their children, and other matters arising from the termination of their partnership.\n"
            unicode"\n"
            unicode"IN WITNESS WHEREOF, the Partners have signed this Agreement as of the date first above written.\n"
            unicode"\n"
            unicode"Signatures:";
        // forgefmt: disable-end

        data.height = 2060;
        data.color = PinkyPromise.PromiseColor.RedAlert;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        broadcastPromise(pk1, data, addrs);
    }

    function exampleArtistsCollab() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"Artists collab";
        // forgefmt: disable-start
        data.body = 
            unicode"We are Marie Plunkert (@mplk) & 3frizzz (@3frizzz), and we’re super excited about our upcoming artistic collaboration! To make sure we’re on the same page and everything goes smoothly, we’ve put together this informal agreement to outline our expectations and responsibilities.\n"
            unicode"\n"
            unicode"We’ll be working together on a new secret project, which we’ve decided to call “Untitled 44”. The goal of this collaboration is to merge our unique styles and perspectives to create something truly unique, weird and captivating for our collective audience.\n"
            unicode"\n"
            unicode"We’ll aim to complete this project by 20th June, 2023. We’ll keep in touch regularly to share updates, feedback, and address any challenges that arise. If either of us needs to adjust the timeline, we’ll communicate openly and find a solution that works for both of us.\n"
            unicode"\n"
            unicode"Upon completion, we’ll both have equal ownership of the artwork and are free to showcase, sell, or promote it as we see fit. We’ll credit each other in promotional materials, social media posts, and other contexts where the artwork is shared or discussed.\n"
            unicode"\n"
            unicode"We’ll each cover our own costs related to the creation of the artwork. If there are any shared expenses, we’ll discuss and split them fairly. If our collaboration generates any profits (e.g., from sales, exhibitions, or merchandise), we’ll split those profits equally between us.\n"
            unicode"\n"
            unicode"We’re both thrilled about this artistic collaboration and can’t wait to get started! 🎨\n"
            unicode"\n"
            unicode"Marie & 3frizzz";
        // forgefmt: disable-end

        data.height = 1388;
        data.color = PinkyPromise.PromiseColor.Solemn;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        broadcastPromise(pk1, data, addrs);
    }

    function exampleManifesto() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"Playful Design Manifesto for Creative Blockchain Ecosystems";
        // forgefmt: disable-start
        data.body =
            unicode"We, the B0xK collective, are a community of designers, developers, and innovators committed to shaping creative, engaging, and vibrant blockchain ecosystems. Our Playful Design Manifesto highlights the principles that inspire our imaginative and user-centric creations.\n"
            unicode"\n"
            unicode"1. Joyful User Experience. We prioritize the creation of delightful, engaging, and intuitive experiences for our users. We design blockchain solutions that are not only functional but also foster joy, curiosity, and a sense of wonder in diverse users.\n"
            unicode"\n"
            unicode"2. Creativity and Innovation. We embrace the transformative potential of blockchain technology and strive to develop novel, imaginative solutions that challenge conventions and push boundaries. We believe in the power of creative thinking to drive positive change and shape a more inclusive and equitable world.\n"
            unicode"\n"
            unicode"3. Exploration and Experimentation. We cultivate a spirit of exploration and experimentation, encouraging our community to test new ideas, iterate, and learn from both successes and failures. We view each project as an opportunity to grow, adapt, and evolve as creators and individuals.\n"
            unicode"\n"
            unicode"4. Collaboration and Shared Inspiration. We value the power of collaboration and actively engage with our peers, clients, and communities. We celebrate the collective creativity that emerges from diverse perspectives and strive to create a supportive, inclusive environment that fosters open dialogue and shared ownership of our work.\n"
            unicode"\n"
            unicode"5. Gamification and Play. We incorporate elements of play and gamification into our blockchain designs, making complex concepts and systems more approachable, accessible, and engaging. We believe that playful interactions can inspire learning, motivate user engagement, and build stronger, more vibrant communities.\n"
            unicode"\n"
            unicode"6. Ethical Creativity. We act with integrity, transparency, and responsibility in all aspects of our work. We acknowledge the social and environmental impact of our creations, and we strive to develop playful blockchain solutions that are not only fun but also promote fairness, inclusivity, and sustainability.\n"
            unicode"\n"
            unicode"By adhering to these principles, we reaffirm our dedication to the power of playful design as a catalyst for positive transformation of blockchain ecosystems. We pledge to navigate the complexities and challenges of our work with empathy, humility, and unwavering ethical commitment, striving to create a better, more vibrant world for present and future generations.";
        // forgefmt: disable-end

        data.height = 1706;
        data.color = PinkyPromise.PromiseColor.RedAlert;

        address[] memory addrs = new address[](3);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);
        addrs[2] = vm.addr(pk3);

        broadcastPromise(pk1, data, addrs);
    }

    function exampleBet() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"Fun bet";
        // forgefmt: disable-start
        data.body =
            unicode"We are Alix and Jean,\n"
            unicode"Let’s make a friendly bet on the future of AGI 🤖\n"
            unicode"\n"
            unicode"By January 1st, 2024, AGI will be able to perform any intellectual task that a human can do and this is validated by scientific consensus.\n"
            unicode"\n"
            unicode"If AGI has been achieved by the chosen date and meets the conditions outlined above:\n"
            unicode"\n"
            unicode"- Alix will treat Jean to an extravagant dinner at the fanciest restaurant in town and wear a T-shirt that says, “I bow to our AGI overlords!” for an entire day.\n"
            unicode"- Jean will have bragging rights and can gloat about their futuristic foresight for the rest of eternity (or at least until the next bet).\n"
            unicode"\n"
            unicode"If AGI has NOT been achieved by the chosen date or doesn’t meet the conditions outlined above:\n"
            unicode"\n"
            unicode"- Jean will treat Alix to a luxurious spa day and wear a T-shirt that says, “AGI? More like Ah- Gee, I was wrong!” for an entire day.\n"
            unicode"- Alix will have bragging rights and can mock Jean’s over-optimism until the end of time (or, again, until the next bet).\n"
            unicode"\n"
            unicode"May the best futurist win!";
        // forgefmt: disable-end

        data.height = 1192;
        data.color = PinkyPromise.PromiseColor.Pinky;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        broadcastPromise(pk1, data, addrs);
    }

    function examplePersonalPledge() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"Personal Pledge";
        // forgefmt: disable-start
        data.body =
            unicode"Dear fellow humans, friends and family,\n"
            unicode"\n"
            unicode"I, Sofia Moran, am taking a leap towards a greener future by making this fun public pledge! I want to sprinkle my love for the environment all over the place and show that we can make a difference while having a blast! 🌎💚✨\n"
            unicode"\n"
            unicode"- I’ll be a waste warrior, diligently recycling, upcycling, and reducing single-use plastics ♻️💚\n"
            unicode"- I’ll become a savvy energy saver, switching off lights and appliances when not in use, and embracing the power of natural light and fresh air ☀️🌊\n"
            unicode"- I promise to support local, eco-friendly, and ethical businesses. Let’s strengthen our communities and make our planet proud! 🌱💚🛍\n"
            unicode"\n"
            unicode"I invite you all to join me, hold me accountable, and share your own eco-adventures! Together, we can create a vibrant, healthy, and sustainable world that’s bursting with fun and joy! 🌍🌈🎉";
        // forgefmt: disable-end

        data.height = 1008;
        data.color = PinkyPromise.PromiseColor.Electric;

        address[] memory addrs = new address[](1);
        addrs[0] = vm.addr(pk1);

        broadcastPromise(pk1, data, addrs);
    }

    function exampleCommunityContributionAgreement() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"Community Contribution Agreement";

        // forgefmt: disable-start
        data.body =
            unicode"This agreement outlines the collaboration between DadaDAO and norbie.eth. Below are the expectations and responsibilities for this collaboration:\n"
            unicode"\n"
            unicode"## Project Description:\n"
            unicode"\n"
            unicode"norbie.eth will provide their expertise in content creation and digital marketing to support and contribute to DadaDAO mission and objectives.\n"
            unicode"\n"
            unicode"## Timeline:\n"
            unicode"\n"
            unicode"This collaboration will commence on 01-05-2023 and continue for three months or until either party decides to discontinue the collaboration with a two-weeks notice period.\n"
            unicode"\n"
            unicode"## Roles & Responsibilities:\n"
            unicode"\n"
            unicode"DadaDAO will provide necessary resources, access, and support for norbie.eth to perform their tasks effectively. norbie.eth will contribute their skills, knowledge, and time to the best of their ability to help achieve the objectives set by DadaDAO for all Q2 initiatives.\n"
            unicode"\n"
            unicode"## Compensation:\n"
            unicode"\n"
            unicode"norbie.eth will receive a monthly stipend of $3000 as well as a package of 600 $DADA (the DAO’s native token) for their contributions.\n"
            unicode"\n"
            unicode"## Termination:\n"
            unicode"\n"
            unicode"Either party may decide to discontinue the collaboration by providing a written notice two weeks in advance.";
        // forgefmt: disable-end

        data.height = 1392;
        data.color = PinkyPromise.PromiseColor.Solemn;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        broadcastPromise(pk1, data, addrs);
    }

    function ex1() public {
        PinkyPromise.PromiseData memory data;
        data.title = unicode"This year, no more:";
        // forgefmt: disable-start
        data.body =
            unicode"People-pleasing,\n"
            unicode"toxic relationships,\n"
            unicode"fake friendships,\n"
            unicode"self-doubts and excuses.";
        // forgefmt: disable-end
        data.color = PinkyPromise.PromiseColor.Pinky;

        address[] memory addrs = new address[](1);
        addrs[0] = vm.addr(pk1);

        broadcastPromise(pk1, data, addrs);
    }

    function ex2() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"I don’t call them new year’s resolutions";
        data.body =
            unicode"I prefer the term “casual promises to myself that I am under no legal obligation to fulfil”.";
        data.color = PinkyPromise.PromiseColor.Electric;

        address[] memory addrs = new address[](1);
        addrs[0] = vm.addr(pk1);

        broadcastPromise(pk1, data, addrs);
    }

    function ex3() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"dc9992d1aae1dfc29d2dd302442171218099e656882ef8b78907b1af8912678b";
        data.body = unicode"c77b82d3672086147b5f4d67b2d6fde924e55475919247d13802abe8fb7e373e";
        data.color = PinkyPromise.PromiseColor.Electric;

        address[] memory addrs = new address[](3);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);
        addrs[2] = vm.addr(pk3);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
        broadcastSign(pk3, id);
    }

    function ex4() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"kenkouDAO x LongLifeLabs – a natural symbiosis";
        data.body =
            unicode"kenkouDAO and LongLifeLabs are driven by a shared goal to enable progress in the life sciences and biotechnology by breaking down the barriers that slow experimentation.\n\n"
            unicode"This partnership brings LongLifeLabs’s extensive CRO network and expertise in experimental outsourcing into the kenkouDAO community. Together, kenkouDAO and LongLifeLabs will continue to build on the mission to accelerate the transformation of ideas into biological insight.";
        data.color = PinkyPromise.PromiseColor.Pinky;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
    }

    function ex5() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"Dave x Omni Brew #1";
        // forgefmt: disable-start
        data.body=
            unicode"Dave will brew 6000 liters of his “Pretty Pale Dave Ale” for Omni Brew by September 2023, delivered in 30L kegs.* Omni Brew will pay Dave 4000 DAI for every 1000 liters delivered.\n\n"
            unicode"*Kegs to be returned or bought (50 DAI / keg).";
    // forgefmt: disable-end
        data.color = PinkyPromise.PromiseColor.RedAlert;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
    }

    function ex6() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"BFFL";
        data.body = unicode"You and me\npromise\nwe’ll be best friends\nfor life 👩‍❤️‍👩";
        data.color = PinkyPromise.PromiseColor.Pinky;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
    }

    function ex7() public {
        PinkyPromise.PromiseData memory data;

        data.title = unicode"Co-creators partnership agreement";
        data.body =
            unicode"This pact is created between the following parties: 0x4675C7e5BaAFBFFbca748158bEcBA61ef3b0a263 (Creator 1) and 0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5 (Creator 2), collectively referred to as “the parties”.\n\n"
            unicode"Whereas, the parties wish to associate themselves as co-creators or partners in a business enterprise and will share the profits equally, realised from the sale of any products and/or services provided by this partnership.";
        data.color = PinkyPromise.PromiseColor.Solemn;

        address[] memory addrs = new address[](2);
        addrs[0] = vm.addr(pk1);
        addrs[1] = vm.addr(pk2);

        uint256 id = broadcastPromise(pk1, data, addrs);
        broadcastSign(pk2, id);
    }
}
