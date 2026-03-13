import Thread from "../models/thread.model.js";
import Message from "../models/message.model.js";
import ApiResponse from "../uttils/ApiResponse.js";
import ErrorResponse from "../uttils/ErrorClass.js";
import User from "../models/user.model.js";
import main from "../uttils/winter.AI.js";

export const getAllThreads = async (req, res, next) => {
    try {
        let threads = await Thread.find({ user: req.user._id }).sort({ updatedAt: -1 }); // fixed typo: updatesAt → updatedAt

        return res.status(200).json(new ApiResponse('Threads fetched successfully', 200, threads));
    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

export const getThread = async (req, res, next) => {
    try {
        let threadId = req.params.threadId;

        let thread = await Thread.findOne({ threadId }).populate('messages');

        if (!thread) {
            return next(new ErrorResponse('Thread not found', 404));
        }

        return res.status(200).json(new ApiResponse('Thread fetched successfully', 200, thread));
    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

export const deleteThread = async (req, res, next) => {
    try {
        let threadId = req.params.threadId;

        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            return next(new ErrorResponse('Thread not found', 404));
        }

        if (thread.user.toString() !== req.user._id.toString()) {
            return next(new ErrorResponse('You are not authorized to delete this thread', 403));
        }

        // Also delete all messages in the thread
        await Message.deleteMany({ _id: { $in: thread.messages } });
        await thread.deleteOne();

        return res.status(200).json(new ApiResponse('Thread deleted successfully', 200));
    } catch (error) {
        next(new ErrorResponse(error.message, 500));
    }
}

export const chat = async (req, res, next) => {
    try {
        const threadId = req.params.threadId;
        const userMessage = req.body.message;

        if (!userMessage || !userMessage.trim()) {
            return next(new ErrorResponse('Message is required', 400));
        }

        // Find or create thread
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            thread = await Thread.create({
                title: userMessage.slice(0, 60), // trim long titles
                threadId,
                user: req.user._id,
                role: 'user',
            });
        }

        // Save user message
        const message = await Message.create({ text: userMessage, role: 'user' });
        thread.messages.push(message._id);
        await thread.save();

        // Call Gemini
        let aiText;
        try {
            aiText = await main(userMessage);
        } catch (aiError) {
            console.error('Gemini error:', aiError.message || aiError);
            return next(new ErrorResponse('AI service error: ' + (aiError.message || 'Unknown error'), 500));
        }

        if (!aiText || !aiText.trim()) {
            return next(new ErrorResponse('AI returned an empty response', 500));
        }

        // Save AI message
        const aiMessage = await Message.create({ text: aiText, role: 'assistant' });
        thread.messages.push(aiMessage._id);
        await thread.save();

        return res.status(200).json(new ApiResponse('Message sent successfully', 200, thread));
    } catch (error) {
        next(new ErrorResponse(error.message || 'Something went wrong', 500));
    }
}
