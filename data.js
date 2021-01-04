module.exports = {
    projects: [
        {
            title: "SMS MANUAL PREPARATION AND REVIEW",
            image: {
                src: "cloudinary/white-boat",
                alt:
                    "An image of a sailing ship in grayscale, by @turbaszek on unsplash.",
            },
            description:
                "Safety management system manual (SMS) is an ofﬁcial document that depicts how a shipping company plans and implements policies to ensure safety of their ships and the marine environment.",
            keywords:
                "safety management, maritime environment, mandatory safety, regulation, training, codes and guidelines",
            article:
                "Safety management system manual (SMS) is an ofﬁcial document that depicts how a shipping company plans and implements policies to ensure safety of their ships and the marine environment. \n\nSafety management system is a vital part of the international safety management code as developed by the International Maritime Organization and it ensures that policies, practices and procedures are established and implemented for the safety of the ships at sea.\n\nThe safety management system also ensures that ships comply with internationally accepted mandatory safety rules and regulation, codes, guidelines and international standard recommended by the various ﬂag administrations, classiﬁcation society and the international maritime organization. \n\nJOCL prepare the safety management system manual as per your organizations structure (whether small or big), train your employees how to implement procedure as per the manual, organize your system to operate effectively and efﬁciently.",
        },
    ].map((project) => {
        let pageURL = `${project.title
            .toLowerCase()
            .replace(/\s|\\|\//g, "-")}.html`;
        return Object.assign(
            {
                pageURL,
                url: `/projects/${pageURL}`,
            },
            project
        );
    }),
};
