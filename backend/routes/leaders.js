const express = require("express");
const router = express.Router();

const supabaseAdmin = require("../lib/supabaseClient");

/**
 * @route GET /leaders
 * @desc Get all leaders
 * @access Pastor only
 */
/**
 * @route GET /leaders
 * @desc Get all leaders
 * @access Pastor only
 */
router.get("/", async(req,res)=>{

    try {

        // Verify pastor
        const {data:currentUser,error:userError}
            = await supabaseAdmin
            .from("users")
            .select("role")
            .eq("leader_id", req.userId)
            .single();


        if(
            userError ||
            currentUser.role.toLowerCase() !== "pastor"
        ){
            return res.status(403).json({
                error:"Pastor access required"
            });
        }


        const {data:leaders,error}
            = await supabaseAdmin
            .from("users")
            .select(
                "leader_id,user_name,email,group_graduation_year,role"
            )
            .eq(
                "role",
                "leader"
            )
            .order(
                "user_name",
                {
                    ascending:true
                }
            );


        if(error){
            return res.status(400).json({
                error:error.message
            });
        }


        res.json(leaders);


    }catch(err){

        console.error(err);

        res.status(500).json({
            error:"Failed fetching leaders"
        });

    }

});

/**
 * @route GET /leaders/:leaderId/kids
 * @desc Get kids belonging to a specific leader
 * @access Pastor only
 */
router.get("/:leaderId/kids", async(req,res)=>{

    try {

        const {leaderId}=req.params;


        // Verify pastor
        const {data:currentUser,error:userError}
            = await supabaseAdmin
            .from("users")
            .select("role")
            .eq("leader_id",req.userId)
            .single();


        if(
            userError ||
            currentUser.role.toLowerCase() !== "pastor"
        ){
            return res.status(403).json({
                error:"Pastor access required"
            });
        }


        const {data:kids,error:kidError}
            = await supabaseAdmin
            .from("kids")
            .select("*")
            .eq("leader_id",leaderId)
            .order("id");


        if(kidError){
            return res.status(400).json({
                error:kidError.message
            });
        }


        res.json(kids);


    }catch(err){

        console.error(
            "Error fetching leader kids:",
            err
        );

        res.status(500).json({
            error:"Failed to fetch leader kids"
        });

    }

});

/**
 * @route GET /leaders/:leaderId/stats
 * @desc Get leader kid statistics
 * @access Pastor only
 */
router.get("/:leaderId/stats", async(req,res)=>{

    try {

        const {leaderId}=req.params;


        const {data:currentUser}
            = await supabaseAdmin
            .from("users")
            .select("role")
            .eq("leader_id",req.userId)
            .single();


        if(
            currentUser?.role?.toLowerCase()
            !=="pastor"
        ){
            return res.status(403).json({
                error:"Pastor access required"
            });
        }



        const {count:total,error:totalError}
            = await supabaseAdmin
            .from("kids")
            .select("*",
                {
                    count:"exact",
                    head:true
                })
            .eq(
                "leader_id",
                leaderId
            );


        const {count:regular,error:regularError}
            = await supabaseAdmin
            .from("kids")
            .select("*",
                {
                    count:"exact",
                    head:true
                })
            .eq(
                "leader_id",
                leaderId
            )
            .eq(
                "sunday_regulars",
                true
            );


        const {count:baptised,error:baptisedError}
            = await supabaseAdmin
            .from("kids")
            .select("*",
                {
                    count:"exact",
                    head:true
                })
            .eq(
                "leader_id",
                leaderId
            )
            .eq(
                "baptised",
                true
            );


        res.json({

            total_kids:total,
            regular_kids:regular,
            baptised_kids:baptised

        });



    }catch(err){

        console.error(err);

        res.status(500).json({
            error:"Failed to fetch stats"
        });

    }

});

router.get("/:leaderId/attendance", async(req,res)=>{

    try {

        const {leaderId}=req.params;


        const {data:kids,error:kidError}
            = await supabaseAdmin
            .from("kids")
            .select("id")
            .eq("leader_id",leaderId);


        if(kidError)
            throw kidError;


        const kidIds = kids.map(k=>k.id);


        if(kidIds.length===0){
            return res.json([]);
        }


        const {data,error}
            = await supabaseAdmin
            .from("attendance")
            .select("*")
            .in("kidid",kidIds);


        if(error)
            throw error;


        res.json(data);


    }catch(err){

        console.error(err);

        res.status(500).json({
            error:"Failed fetching attendance"
        });

    }

});

router.get("/:leaderId/catchups", async(req,res)=>{

    try{

        const {leaderId}=req.params;


        const {data:kids}
            = await supabaseAdmin
            .from("kids")
            .select("id")
            .eq("leader_id",leaderId);


        const kidIds = kids.map(k=>k.id);


        if(kidIds.length===0)
        {
            return res.json([]);
        }


        const {data,error}
            =
            await supabaseAdmin
                .from("catchups")
                .select(`
*,
kids(
name,
status_code,
baptised,
sunday_regulars
)
`)
                .in("kidid",kidIds)
                .order(
                    "catchupdate",
                    {
                        ascending:false
                    });


        if(error)
            throw error;


        res.json(data);


    }catch(err){

        console.error(err);

        res.status(500).json({
            error:"Failed fetching catchups"
        });

    }


});

router.get("/:leaderId", async(req,res)=>{

    try {

        const {leaderId}=req.params;


        // Check current user's role
        const {data:currentUser,error}=await supabaseAdmin
            .from("users")
            .select("role")
            .eq("leader_id",req.userId)
            .single();


        if(
            error ||
            currentUser.role.toLowerCase() !== "pastor"
        ){
            return res.status(403).json({
                error:"Pastor access required"
            });
        }


        // Fetch leader
        const {data:leader,error:leaderError}
            = await supabaseAdmin
            .from("users")
            .select(
                "leader_id,user_name,email,role"
            )
            .eq(
                "leader_id",
                leaderId
            )
            .single();


        if(leaderError){
            return res.status(404).json({
                error:"Leader not found"
            });
        }


        res.json(leader);


    }catch(err){

        console.error(err);

        res.status(500).json({
            error:"Failed to fetch leader"
        });

    }

});

router.post("/:leaderId/kids", async(req,res)=>{

    try{

        const {leaderId}=req.params;


        const {data,error}
            =
            await supabaseAdmin
                .from("kids")
                .insert([
                    {
                        ...req.body,
                        leader_id:leaderId
                    }
                ])
                .select()
                .single();


        if(error)
            throw error;


        res.json(data);


    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

router.put("/kids/:kidId/transfer",async(req,res)=>{


    try{

        const {kidId}=req.params;

        const {newLeaderId}=req.body;


        const {data,error}
            =
            await supabaseAdmin
                .from("kids")
                .update({
                    leader_id:newLeaderId
                })
                .eq("id",kidId)
                .select()
                .single();


        if(error)
            throw error;


        await supabaseAdmin
            .from("catchups")
            .update({
                leader_id:newLeaderId
            })
            .eq(
                "kidid",
                kidId
            );


        res.json(data);


    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

router.put("/kids/:kidId", async(req,res)=>{

    try{

        const {kidId}=req.params;


        const {data,error}
            =
            await supabaseAdmin
                .from("kids")
                .update(req.body)
                .eq("id",kidId)
                .select()
                .single();


        if(error)
            throw error;


        res.json(data);


    }catch(err){

        console.error(err);

        res.status(500).json({
            error:err.message
        });

    }

});

router.post("/:leaderId/catchups", async(req,res)=>{

    try{

        const {leaderId}=req.params;


        const {data,error}
            =
            await supabaseAdmin
                .from("catchups")
                .insert([
                    {
                        ...req.body,
                        leader_id:leaderId
                    }
                ])
                .select()
                .single();


        if(error)
            throw error;


        res.json(data);


    }catch(err){

        res.status(500).json({
            error:err.message
        });

    }

});

router.put("/:leaderId/catchups/:catchupId",
    async(req,res)=>{


        try{

            const {leaderId,catchupId}=req.params;


            const {data,error}
                =
                await supabaseAdmin
                    .from("catchups")
                    .update(req.body)
                    .eq(
                        "catchupid",
                        catchupId
                    )
                    .eq(
                        "leader_id",
                        leaderId
                    )
                    .select()
                    .single();


            if(error)
                throw error;


            res.json(data);


        }catch(err){

            res.status(500).json({
                error:err.message
            });

        }


    });

module.exports=router;