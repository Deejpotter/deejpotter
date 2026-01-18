# User-provided information (recorded)

This file records the specific information, tone, and wording the user supplied so agents can reference it when drafting customer replies and handling warranty/support cases.

**Recorded on:** 2025-12-01
**Recorded by:** Maker Store chat-agent

---

## Tone / Style

- Tone Name: "Maker Store — Straightforward Technical Support"
- Tone Description: Concise, direct, plain-English, minimal fluff. Use full sentences. Preserve the user's exact wording when they provide text to be used verbatim. Clearly label anything not 100% confirmed as "I'm not sure" and request confirmation. Keep replies short, helpful, and actionable.
- Behavior rules: When the user provides wording to insert verbatim, insert it exactly. When stating Maker Store product/company facts, cite internal docs or say "I'm not sure" and ask for confirmation.

---

## Warranty process (user-supplied text)

The user provided this exact overview of the warranty handling to be used in customer replies:

"For your information, here's an overview of our warranty process:
Upon receiving the items, our engineers will perform a thorough test to determine if any faults are present.
If the item is found to be faulty, we will gladly replace it for you. It's important to note that the warranty period will not be extended for the replacement item.
Maker Store will cover all the shipping costs associated with the return and replacement process.
However, if the item is found to be in working order and not faulty,
We will proceed with resending the item back to you. In such a case, please be aware that you will be invoiced for the total shipping charges incurred during the return process."

(Also recorded: the full Returns, Refunds & Warranty SOP summary supplied earlier and kept in `agents.md` / repo docs — use that SOP when handling returns/warranty.)

---

## Product details (user-supplied listing text)

The user provided the following product listing details for the 2.2kW Water Cooled Spindle (SPINDLE ONLY) + Hose. Record includes SKU and specs exactly as supplied.

SKU: `ELEC-SPIN-2200W-WC`

Description (recorded verbatim from user message):

"2.2kW Water Cooled Spindle (SPINDLE ONLY) + Hose
$607.95 Inc. GST

This Spindle is our recommendation for anyone who wants to take their CNC Router Machine seriously. It is incredibly powerful and quiet, and will be a suitable upgrade from our 1.5kW Air Cooled Spindle.

NOTE: This listing is for the SPINDLE ONLY (including hose). A VFD, Cable, Pump and Bracket are required to install this spindle.

See our 2.2kW Water Cooled Spindle Bundle with everything required to install this spindle!

In stock (can be backordered)

Description
This Spindle includes 5m of Hose suitable for water cooling.
The 2.2kW Water Cooled Spindle is a heavy duty 3 phase spindle suitable for working with wood, plastic, foam, carbon fibre and soft metals including aluminium and brass. This Spindle is a heavy duty tool that will suit small commercial applications. The 2.2kW Water Cooled Spindle is incredibly powerful and quiet, and will be a suitable upgrade from our 1.5kW Air Cooled Spindle.

NOTE: This listing is for the SPINDLE ONLY (including hose). A VFD, Cable, Pump and Bracket are required to install this spindle.

These 2.2kW Water Cooled Spindles have an extended warranty of 2 years.

Assembly Instructions:
Assembly instructions can be found below:

Specifications:
Brand – HuanYang
Spindle Spec: Ø80×240mm (Diameter: 80mm x Length: 240mm)
Power: 2.2kW
Voltage: 220V~250V
Phases: 3
Frequency: 400Hz
Speed: 8000-24000 R/min
Collet Size: ER-20A
Water Cooling
Runout: Between 0.005-0.01mm
Grease Lubrication
Spindle Weight: 5.2kg (without water)
The runout tolerance of this Spindle is between 5 – 10 Microns. When performing a cut the Total Indicated Runout (TRI), which is the runout of the tip of the endmill on the workpiece, is comprised of all the runouts in the system which would include the Spindle, Collet and endmill, please take this into consideration when considering your builds

What is a 3 phase Spindle?
A spindle is a rotating tool that, when a cutting bit is attached, is used to machine a material. Spindles are designed for CNC applications and continuous prolonged use. A spindle is a purpose built tool for a CNC machine that has superior functionality when compared to a router/trimmer. Spindles are generally more expensive (sometimes significantly) than routers/trimmer. All spindles are electrical equipment that require knowledge and caution when installing and using. Spindles are not a tool that a novice with little electrical knowledge or skill should install. If in doubt do not attempt to DIY, incorrect installation especially of larger spindles can be fatal. Installation by a licenced electrician or suitably qualified person is recommended.

Larger spindles such as the 2.2kW Water Cooled Spindle are a 3 phase motor that uses 220VAC+ per phase through electrical windings at high frequency to rotate a shaft. Generally spindles require the user to terminate the wires to each phase in a connector. Terminating wires can be quite difficult to an individual who does not have the experience or skills in delicate soldering. Care must be taken when terminating a spindle connector to ensure there is no short circuit between phases or earth. Spindles have a conductive metallic housing which is incredibly dangerous if exposed to voltage above 50VAC.

How do you power a 3 phase Spindle with a standard wall socket?
3 phase spindles are powered through a VFD (Variable Frequency Drive). This allows single phase power to be converted to 3 phase power. VFDs are complicated electrical equipment although wiring to them is generally a simple single phase input and a 3 phase output. Control wires can be wired to some VFDs which allow spindle speed control through software. VFDs also allow spindle speed control through the VFD control panel which is generally buttons or a dial. VFDs parameters are generally not set from factory for a spindle and do require programming of parameters to suit the application. If critical parameters are set incorrectly a spindle can be irreversibly destroyed in less than 10 seconds. It is imperative that the user thoroughly reads through the VFD manual and completely understands the parameters and settings."

---

## Customer interactions / example replies (user-supplied or user-approved wording)

### Mirko (customer) — original message (recorded)

The user's message from Mirko was recorded earlier; agent replies were drafted and the user supplied company wording. The final simplified reply text created in the user's tone is recorded below and should be used verbatim unless the user requests edits.

"Hi Mirko,

Thanks — I appreciate the clear, straight questions.

The E5X MCS T4.1 is an advanced controller that uses a Teensy 4.x (Teensy 4.1) microcontroller and runs grblHAL, and the recommended host software is ioSender. I can confirm those technical facts from our product documentation and internal wiring/test resources.

First, I know that the E5X is mostly finished but we are still planning some updates in the future. I'm not entirely sure what updates are planned but I belive we will be still doing some tweaks, I belive mostly minor. If we do that, we will likely get in touch with people who have purchased the E5X to let them know about the firmware update so everyone can apply it.

We are expecting to keep supporting the E5X for the forseeable future. As far as I know, we aren't planning to stop manufacturing or supporting the E5X so I would think it should be supported for years to come. We are currently working on the xPRO V6 but the E5X will still be the most featureful controller we sell and we will still provide the same support for it.

The E5X is pretty much the Maker Store controller, only we manufacture and sell it so I would imagine we will keep improving and supporting it for the forseeable future.

I provide technical assistance myself and if I can't find the answer, I can also get help from our engineers to solve most issues.

If you want me to, I can confirm the exact update delivery method (OTA vs. user-applied firmware) and provide a named support contact from engineering, then follow up with a short update. Would you like me to do that?

Regards,
[Your name]
Maker Store"

### Neil (customer) — final reply (user-supplied wording preserved)

The user-approved reply for Neil (preserve wording and tone) is recorded:

"Hi Neil,

Thanks for getting back to me about this and for waiting while I investigated.

I've had a look at the output from the console and it looks like the firmware is using the XYYZ machine profile and the startup checks report the Y2 driver test passed, so the settings look correct for what you're trying to do.

The only other thing I can think of is making sure the correct settings are applied and that the wiring for the 2nd Y-motor is reversed. First, I've attached the correct machine settings file for your machine and you can add that to a macro and apply it to see if that helps at all.

Next, please check the wiring for the cloned Y motor. The wiring for the cloned motor should be reversed from the other Y motor when using a Gear Rack or Timing Belt transmission.

If neither of those solves the problem, it's likely the Y2/A motor driver has some kind of fault. A quick isolation test you can try is swapping the Y2 motor connector with another axis driver (for example, plug the Y motor into the X driver) and see if the fault follows the connector or stays with the controller position. If the fault follows the connector then check the motor and cabling again; if the fault stays with the controller position then the driver is likely at fault. We don't currently have any replacement parts for that controller so the only resolution in that case would be to replace the controller.

We don't provide on-site assistance, just remote support, but I can continue to help step through tests remotely and, if you'd like, I can escalate this to our engineers for further diagnostics.

Please let me know the result of the tests (applied settings, wiring check, and the connector swap) and I will help you from there.

Regards,
[Your name]
Maker Store"

### Isaac Wrathall (customer) — warranty/troubleshoot reply (user wording preserved)

User-approved reply recorded:

"Hi Isaac,

Thanks for letting us know and for the order number (#170488).

My understanding is that we can troubleshoot the driver remotely to see if it's faulty. If we do find that we can't get it working with remote troubleshooting, I can get it returned under warranty and we can test it in store. If the engineers find that they can't get it working either, we can offer a replacement for the customer.

To start, please send the following to team@makerstore.help and include your order number in the subject line:

- A short description of the failure and when it started.
- Photos or a short video showing the driver, the wiring, and any error behaviour.
- Proof of purchase (order confirmation or receipt).
- Tell us whether you would prefer a replacement or a refund if the unit is confirmed faulty.

We will attempt remote troubleshooting first. If we cannot resolve the issue remotely we will issue a Return Authorisation (RA) and ask you to send the unit back. Our warehouse will inspect the returned item and our engineers will test the driver; if they confirm a manufacturing fault and the item is within warranty we will arrange a replacement. If you request a refund and the claim is approved we will process the refund to the original payment method (refunds are processed within 10 business days after approval; note refunds may be subject to restocking/shipping fees where applicable, per our Returns & Warranty SOP).

This product is covered by our standard 12‑month warranty from date of receipt, so your claim is within the warranty period. Please email the details to team@makerstore.help and I’ll pick this up and keep you updated through the process.

Regards,
[Your name]
Maker Store"

---

## Miscellaneous notes recorded from user inputs

- The user is the technical assistance contact and prefers to use full paragraphs, preserve their wording, and avoid spamming customers with troubleshooting steps. Only request photos/video first unless additional tests are required.
- The user expects engineers' approval before issuing a Return Authorisation for warranty testing.
- The user prefers concise answers and that uncertain facts be labelled "I'm not sure".

---

## References / repo locations

- Product docs and controller info: `new docs/CompleteDocumentation.md`, `Maker Store Customer Service Docs/OldInternalFAQ.md`.
- Q&A store: `qas/qas.json` (do not modify without approval).
- Agent files: `.github/agents/chat-agent.md` (tone recorded), `.github/agents/user-provided-info.md` (this file).

---

If you want any additional text recorded here (other exact phrasings, canned replies, or other product listings), tell me exactly what to add and I will append it verbatim.

### Kristy / ALARM 8 - additional technical notes (user-supplied)

Record of user's exact technical logic and suggested wording for Kristy (preserve tone and wording):

"First, I have a feeling that the ALARM: 8 may be because the limit switches are wired Normally Closed (or recommended setup) but in the Machine Settings, the $5 setting is supposed to invert the limit switch logic. I have a feeling the alarm 8 might just be saying that the Limit Switches may be \"Triggered\" so the homing won't start. If that's the case, I would expect the homing to only start for a fraction of a second before showing the alarm.
If that's the case, they can try applying the recommended Machine Settings which I have attached in the draft email I've made.

They mentioned they uploaded the machine configurations but there were some errors.
I have usually seen that when applying the Machine Settings for the Dual Homing setup used on the FORTIS machines.
If they are trying to use that firmware with a standard machine, like the OutBack, it may not work.
I've attached the standard firmware file to the email as well if they want to try reflashing that using these steps:
https://makerhardware.net/knowledge-base/electronics/e5x-wiring-guide/#articleTOC_43
But they don't need to use the B-AXIS wiring, just use the clone port for the 2nd Y-motor.
"

Use this block when drafting the Kristy reply or when an agent needs to reference the recommended settings / reflashing note. Preserve wording when inserted verbatim.

### Mark VFD / Dust Shoe reply (user-supplied)

The following reply was provided by the user and is recorded verbatim. Use this exact wording and tone when appropriate.

"Hi Mark,

Thanks for getting in touch.

VFD
I haven't seen that error before but I found it in the VFD manual:
image.png

My best guess is that it sounds like you might need to double check the wiring and programmed settings for the VFD:
https://makerhardware.net/knowledge-base/electronics/e5x-wiring-guide/#articleTOC_18

Based on the recommendations from the BD600 manual I sent through, it sounds like it may be one of these:
Acceleration time 1
F00.12 = 5
Deceleration time 1
F00.13 = 5
Motor Rated Power: (Ensure that you choose the correct motor power rating for your spindle)
1.5kW: F02.01 = 1.5
2.2kW: F02.01 = 2.2
Motor Rated Voltage
F02.04 = 220
But the safest bet would be to reset all the settings to make sure they are all accurate.

One thing I can see is that the end of your G-code file is slightly different from the one I just generated with our post processor:
Mine:
image.png

Yours:
image.png

As far as I can see, your G-code should be fine.

G1 and G0 are both fast movements so those shouldn't be an issue.
M5 should turn the spindle off but it wasn't generated by mine so I'm not sure what's going on there.
M30 resets the file back to the start in case you want to run it again so I thought that could be causing something but that's what was output for me too.
The only other thing I can see is that mine was generated with % before and after the code, I'm not sure what causes that but maybe just confirm that you've selected the Maker Store post processor in your NC file:
image.png

If you need the link, you can find it here:
https://makerhardware.net/knowledge-base/how-to-guides/cnc-workflow-using-fusion-360-for-cnc/#articleTOC_4

Or here's the direct link:
https://makerhardware.net/wp-content/uploads/2024/01/Maker-Store-Fusion360-Postprocessor.zip

Dust Shoe
The Dust Shoe is pretty easy.
You pretty much just need to know the diameter of your spindle (80mm for the 2.2kW), and the diameter of your vacuum hose you want to use.

Here's a cheap one on Aliexpress: https://www.aliexpress.com/p/tesla-landing/index.html?scenario=c_ppc_item_bridge&productId=1005001273407391

If you want to make your own, you can also find heaps of 3D printable files online.
I like Thingiverse:
https://www.thingiverse.com/thing:4728278/files

If you want to make your own, we have Dust Shoe Bristles here:
https://www.makerstore.com.au/product/hard-dsb/

---

Original customer message (recorded):

"hi Daniel,

New week new issue i guess.

i'm having trouble with iosender and the vfd. ive got the machine running fine but at the end of running a program the vfd throws a code \"E-00A\". i can reset the machine by restarting iosender and the router but it then drops it into local control \"H00\" mode causing me to manually switch it back to \"F00\". Any ideas?

I'll attach a gcode in case it's coming from fusion 360.

Also in regards to dust collectors/ vacuum systems, have you guys got a solution for this router? or alternatively are there 3d models available for print? even a model of the z axis assembly that it can build from? i know its unlikely as it'd be sharing maker store's ip but it'll save me a f-tonne of time modelling.

cheers

Mark

fortis_table_brace.nc (108 KB)"
